import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Return from '@/models/Return';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { orderId, reason } = await req.json();
    const userId = (session.user as Record<string, unknown>).id as string;

    if (!orderId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const orderObjectId = new mongoose.Types.ObjectId(orderId);

    // Check if order belongs to user
    const order = await Order.findOne({
      _id: orderObjectId,
      userId: userObjectId,
    }).lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if within 15 days
    const orderDate = new Date(order.createdAt);
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    if (orderDate < fifteenDaysAgo) {
      return NextResponse.json(
        { error: 'Return period expired (must be within 15 days)' },
        { status: 400 }
      );
    }

    // Create return with pending status
    const returnRecord = await Return.create({
      orderId: orderObjectId,
      userId: userObjectId,
      reason,
      status: 'pending',
      refundAmount: order.totalAmount,
    });

    return NextResponse.json(
      {
        success: true,
        returnId: returnRecord._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create return error:', error);
    return NextResponse.json(
      { error: 'Failed to create return' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 }
      );
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    await dbConnect();

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const orderObjectId = new mongoose.Types.ObjectId(orderId);

    // Check if order belongs to user
    const order = await Order.findOne({
      _id: orderObjectId,
      userId: userObjectId,
    }).lean();

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const returnRecord = await Return.findOne({
      orderId: orderObjectId,
    }).lean();

    return NextResponse.json({
      return: returnRecord || null,
    });
  } catch (error) {
    console.error('Get return error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch return' },
      { status: 500 }
    );
  }
}
