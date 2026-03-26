import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import CartAbandoned from '@/models/CartAbandoned';
import mongoose from 'mongoose';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== 'admin') {
    return false;
  }
  return true;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ cartId: string }> }
) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { cartId } = await params;

    await dbConnect();

    await CartAbandoned.updateOne(
      { _id: new mongoose.Types.ObjectId(cartId) },
      {
        emailSent: true,
        emailSentAt: new Date(),
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark email sent error:', error);
    return NextResponse.json(
      { error: 'Failed to mark email as sent' },
      { status: 500 }
    );
  }
}
