import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import CartAbandoned from '@/models/CartAbandoned';
import User from '@/models/User';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== 'admin') {
    return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const abandonedCarts = await CartAbandoned.find({
      emailSent: false,
      createdAt: { $gte: twentyFourHoursAgo },
    })
      .populate('userId', 'email')
      .lean();

    const carts = abandonedCarts.map((cart) => ({
      id: cart._id,
      userId: cart.userId,
      userEmail: (cart.userId as any)?.email || '',
      cartValue: cart.cartValue,
      items: cart.items,
    }));

    return NextResponse.json({ carts });
  } catch (error) {
    console.error('Get abandoned carts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abandoned carts' },
      { status: 500 }
    );
  }
}
