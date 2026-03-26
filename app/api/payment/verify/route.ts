import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { isMongoConfigured } from '@/lib/mongodb';
import { updateDemoOrder } from '@/lib/demoBackend';

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    // Demo mode: mark as paid without Razorpay verification.
    if (!isMongoConfigured()) {
      if (orderId) {
        updateDemoOrder(String(orderId), {
          paymentStatus: "paid",
          razorpayOrderId,
          razorpayPaymentId,
        });
      }
      return NextResponse.json({ success: true });
    }

    await dbConnect();

    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpayKeySecret) {
      return NextResponse.json({ success: false, error: 'Razorpay is not configured' }, { status: 500 });
    }

    // Verify signature using HMAC SHA256
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex');

    const isValid = expectedSignature === razorpaySignature;

    if (!isValid) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    // Update order payment status
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      razorpayPaymentId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
