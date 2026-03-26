import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import { getRazorpay } from '@/lib/razorpay';
import { triggerOrderConfirmation } from '@/lib/emailTriggers';
import { checkLowStock } from '@/lib/stockAlerts';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { items, shippingAddress, deliveryCharge = 0, discount = 0, couponCode = null } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const razorpay = getRazorpay();
    if (!razorpay) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    await dbConnect();

    // Fetch actual product prices from database
    const productIds = items.map((item: Record<string, unknown>) => {
      const id = item.productId;
      return typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id;
    }) as mongoose.Types.ObjectId[];
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length === 0) {
      return NextResponse.json({ error: 'Products not found' }, { status: 400 });
    }

    // Recalculate amount from actual DB prices (prevent manipulation)
    let calculatedAmount = 0;
    for (const item of items as Array<Record<string, unknown>>) {
      const product = dbProducts.find(p => p._id.toString() === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      }
      const price = product.discountPrice || product.price;
      const quantity = Number(item.quantity) || 1;
      calculatedAmount += price * quantity;
    }

    // Add delivery charge
    calculatedAmount += Number(deliveryCharge) || 0;

    // Re-validate and apply coupon server-side (prevent client-side manipulation)
    let validatedDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: String(couponCode).toUpperCase(),
        isActive: true,
        $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
      });

      if (coupon) {
        // Verify coupon constraints
        if (coupon.usedCount < coupon.maxUses && calculatedAmount >= coupon.minOrderAmount) {
          validatedDiscount =
            coupon.discountType === "percentage"
              ? Math.floor((calculatedAmount * coupon.discountValue) / 100)
              : coupon.discountValue;
        }
      }
    } else {
      // If no coupon code provided, use the discount value sent (for non-coupon discounts like admin discounts)
      validatedDiscount = Math.min(Number(discount) || 0, calculatedAmount);
    }

    calculatedAmount -= validatedDiscount;

    // Ensure amount is positive
    if (calculatedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(calculatedAmount * 100),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    // Create order in DB
    const order = await Order.create({
      userId: new mongoose.Types.ObjectId((session.user as Record<string, unknown>).id as string),
      items,
      shippingAddress,
      totalAmount: calculatedAmount,
      deliveryCharge: deliveryCharge || 0,
      discount: validatedDiscount,
      couponCode: couponCode || null,
      paymentStatus: 'pending',
      orderStatus: 'Processing',
      razorpayOrderId: razorpayOrder.id,
    });

    // Trigger email and stock alerts in background (don't wait for completion)
    (async () => {
      try {
        await triggerOrderConfirmation(order._id.toString());
      } catch (error) {
        console.error('Failed to send order confirmation email:', error);
      }

      // Check and notify for low stock on all items in order
      try {
        for (const item of items as Array<Record<string, unknown>>) {
          await checkLowStock(item.productId as string);
        }
      } catch (error) {
        console.error('Failed to check stock alerts:', error);
      }
    })();

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
