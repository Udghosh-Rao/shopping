import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import mongoose from 'mongoose';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;

  await dbConnect();
  const user = await User.findById((session.user as Record<string, unknown>).id);
  return user && user.role === 'admin';
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
    }

    const data = await req.json();
    const { code, discountType, discountValue, maxUses, minOrderAmount, expiresAt, isActive } = data;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    if (code && code.toUpperCase() !== coupon.code) {
      const existing = await Coupon.findOne({ code: code.toUpperCase() });
      if (existing) {
        return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
      }
      coupon.code = code.toUpperCase();
    }

    if (discountType !== undefined) {
      if (!['percentage', 'flat'].includes(discountType)) {
        return NextResponse.json(
          { error: 'Invalid discountType. Must be "percentage" or "flat"' },
          { status: 400 }
        );
      }
      coupon.discountType = discountType;
    }

    if (discountValue !== undefined) {
      if (discountValue < 0) {
        return NextResponse.json({ error: 'Discount value cannot be negative' }, { status: 400 });
      }
      if (coupon.discountType === 'percentage' && (discountValue < 0 || discountValue > 100)) {
        return NextResponse.json(
          { error: 'Percentage discount must be between 0 and 100' },
          { status: 400 }
        );
      }
      coupon.discountValue = discountValue;
    }

    if (maxUses !== undefined) coupon.maxUses = maxUses;
    if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
    if (expiresAt !== undefined) coupon.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();
    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    coupon.isActive = false;
    await coupon.save();

    return NextResponse.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid coupon ID' }, { status: 400 });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
