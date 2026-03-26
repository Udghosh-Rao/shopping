import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getRazorpay } from '@/lib/razorpay';
import mongoose from 'mongoose';
import { addDemoOrder } from '@/lib/demoBackend';
import { isMongoConfigured } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, items, shippingAddress, deliveryCharge, discount } = body;

    const razorpay = getRazorpay();
    const mongoOk = isMongoConfigured();

    // Demo mode: create a local order and mark as paid.
    if (!mongoOk || !razorpay) {
      const userId = (session.user as Record<string, unknown>).id as string;
      const orderId = `demo-order-${Date.now()}`;

      addDemoOrder({
        _id: orderId,
        userId,
        items: (items as Array<Record<string, unknown>>).map((it) => ({
          name: String(it.name ?? ""),
          image: String(it.image ?? ""),
          size: String(it.size ?? ""),
          quantity: Number(it.quantity ?? 1),
          price:
            typeof it.price === "number"
              ? it.price
              : typeof it.discountPrice === "number"
                ? it.discountPrice
                : 0,
        })),
        shippingAddress,
        totalAmount: amount,
        deliveryCharge: deliveryCharge || 0,
        discount: discount || 0,
        paymentStatus: "paid",
        orderStatus: "Processing",
        razorpayOrderId: "demo",
      });

      return NextResponse.json({
        orderId,
        razorpayOrderId: "demo",
        amount: amount * 100,
      });
    }

    await dbConnect();

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    // Create order in DB
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId((session.user as Record<string, unknown>).id as string),
      items,
      shippingAddress,
      totalAmount: amount,
      deliveryCharge: deliveryCharge || 0,
      discount: discount || 0,
      paymentStatus: 'pending',
      orderStatus: 'Processing',
      razorpayOrderId: razorpayOrder.id,
    });

    return NextResponse.json({
      orderId: order._id.toString(),
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
