import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import CartAbandoned from '@/models/CartAbandoned';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const { items, cartValue } = await req.json();

    if (!items || !cartValue) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    if (session?.user) {
      const userId = (session.user as Record<string, unknown>).id as string;
      await CartAbandoned.create({
        userId: new mongoose.Types.ObjectId(userId),
        items,
        cartValue,
        emailSent: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart abandon error:', error);
    return NextResponse.json(
      { error: 'Failed to record abandoned cart' },
      { status: 500 }
    );
  }
}
