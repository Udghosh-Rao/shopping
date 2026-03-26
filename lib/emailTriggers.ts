import resend from './resend';
import dbConnect from './mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Return from '@/models/Return';
import Product from '@/models/Product';
import {
  orderConfirmation,
  abandonedCartRecovery,
  returnApproved,
  returnRejected,
  wishlistRestock,
  lowStockAlert,
} from './emailTemplates';
import mongoose from 'mongoose';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

export async function triggerOrderConfirmation(orderId: string) {
  try {
    await dbConnect();

    const order = await Order.findById(orderId).lean();
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    const user = await User.findById(order.userId).lean();
    if (!user) {
      console.error(`User not found for order: ${orderId}`);
      return;
    }

    const emailData = orderConfirmation(order as any, user as any);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: emailData.subject,
      html: emailData.html,
    });

    console.log(`Order confirmation email sent to ${user.email}:`, result);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
}

export async function triggerReturnApproved(returnId: string) {
  try {
    await dbConnect();

    const returnRecord = await Return.findById(returnId).lean();
    if (!returnRecord) {
      console.error(`Return not found: ${returnId}`);
      return;
    }

    const user = await User.findById(returnRecord.userId).lean();
    if (!user) {
      console.error(`User not found for return: ${returnId}`);
      return;
    }

    const emailData = returnApproved(returnRecord as any, user as any, returnRecord.refundAmount);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: emailData.subject,
      html: emailData.html,
    });

    console.log(`Return approved email sent to ${user.email}:`, result);
    return result;
  } catch (error) {
    console.error('Error sending return approved email:', error);
  }
}

export async function triggerReturnRejected(returnId: string) {
  try {
    await dbConnect();

    const returnRecord = await Return.findById(returnId).lean();
    if (!returnRecord) {
      console.error(`Return not found: ${returnId}`);
      return;
    }

    const user = await User.findById(returnRecord.userId).lean();
    if (!user) {
      console.error(`User not found for return: ${returnId}`);
      return;
    }

    const emailData = returnRejected(returnRecord as any, user as any, returnRecord.adminNotes || '');

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: emailData.subject,
      html: emailData.html,
    });

    console.log(`Return rejected email sent to ${user.email}:`, result);
    return result;
  } catch (error) {
    console.error('Error sending return rejected email:', error);
  }
}

export async function triggerWishlistRestock(productId: string) {
  try {
    await dbConnect();

    const product = await Product.findById(productId).lean();
    if (!product) {
      console.error(`Product not found: ${productId}`);
      return;
    }

    const users = await User.find({ wishlist: new mongoose.Types.ObjectId(productId) }).lean();
    if (users.length === 0) {
      console.log(`No users with product in wishlist: ${productId}`);
      return;
    }

    const results = await Promise.allSettled(
      users.map((user) => {
        const emailData = wishlistRestock(product as any, user as any);
        return resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: emailData.subject,
          html: emailData.html,
        });
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`Restock emails sent: ${successful} successful, ${failed} failed`);
    return { successful, failed };
  } catch (error) {
    console.error('Error sending wishlist restock emails:', error);
  }
}

export async function triggerLowStockAlert(productId: string) {
  try {
    if (!ADMIN_EMAIL) {
      console.warn('ADMIN_EMAIL not configured, skipping low stock alert');
      return;
    }

    await dbConnect();

    const product = await Product.findById(productId).lean();
    if (!product) {
      console.error(`Product not found: ${productId}`);
      return;
    }

    const emailData = lowStockAlert(product as any, ADMIN_EMAIL);

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: emailData.subject,
      html: emailData.html,
    });

    console.log(`Low stock alert sent to admin:`, result);
    return result;
  } catch (error) {
    console.error('Error sending low stock alert:', error);
  }
}

export async function triggerAbandonedCartEmails(hoursAgo: number = 24) {
  try {
    await dbConnect();

    const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

    const CartAbandoned = require('@/models/CartAbandoned').default;
    const abandonedCarts = await CartAbandoned.find({
      emailSent: false,
      createdAt: { $lt: cutoffTime },
    })
      .populate('userId')
      .lean();

    if (abandonedCarts.length === 0) {
      console.log('No abandoned carts to process');
      return { sent: 0, failed: 0 };
    }

    const results = await Promise.allSettled(
      abandonedCarts.map(async (cart: any) => {
        const user = cart.userId as any;
        const emailData = abandonedCartRecovery(user, cart.items, cart.cartValue);

        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: emailData.subject,
          html: emailData.html,
        });

        await CartAbandoned.findByIdAndUpdate(cart._id, {
          emailSent: true,
          emailSentAt: new Date(),
        });
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`Abandoned cart emails sent: ${successful} successful, ${failed} failed`);
    return { sent: successful, failed };
  } catch (error) {
    console.error('Error sending abandoned cart emails:', error);
    return { sent: 0, failed: 0 };
  }
}
