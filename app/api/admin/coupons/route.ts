import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import User from '@/models/User';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;

  await dbConnect();
  const user = await User.findById((session.user as Record<string, unknown>).id);
  return user && user.role === 'admin';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10')));
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};
    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const skip = (page - 1) * limit;
    const [coupons, total] = await Promise.all([
      Coupon.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Coupon.countDocuments(query),
    ]);

    return NextResponse.json({
      coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const data = await req.json();

    const { code, discountType, discountValue, maxUses, minOrderAmount, expiresAt } = data;

    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: code, discountType, discountValue' },
        { status: 400 }
      );
    }

    if (!['percentage', 'flat'].includes(discountType)) {
      return NextResponse.json(
        { error: 'Invalid discountType. Must be "percentage" or "flat"' },
        { status: 400 }
      );
    }

    if (discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: 'Percentage discount must be between 0 and 100' },
        { status: 400 }
      );
    }

    if (discountValue < 0) {
      return NextResponse.json({ error: 'Discount value cannot be negative' }, { status: 400 });
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      maxUses: maxUses || 100,
      minOrderAmount: minOrderAmount || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
      usedCount: 0,
    });

    await coupon.save();
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
