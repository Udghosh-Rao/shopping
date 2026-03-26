import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Return from '@/models/Return';
import {
  triggerOrderConfirmation,
  triggerReturnApproved,
  triggerReturnRejected,
  triggerWishlistRestock,
  triggerLowStockAlert,
} from '@/lib/emailTriggers';
import mongoose from 'mongoose';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== 'admin') {
    return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { type, recipientIds } = await req.json();

    if (!type || !recipientIds || !Array.isArray(recipientIds)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    await dbConnect();

    let sent = 0;
    let failed = 0;

    for (const id of recipientIds) {
      try {
        switch (type) {
          case 'order-confirmation':
            const order = await Order.findById(id);
            if (order) {
              await triggerOrderConfirmation(id);
              sent++;
            }
            break;

          case 'return-approved':
            const returnRecord = await Return.findById(id);
            if (returnRecord && returnRecord.status === 'approved') {
              await triggerReturnApproved(id);
              sent++;
            }
            break;

          case 'return-rejected':
            const rejectedReturn = await Return.findById(id);
            if (rejectedReturn && rejectedReturn.status === 'rejected') {
              await triggerReturnRejected(id);
              sent++;
            }
            break;

          case 'restock-alert':
            await triggerWishlistRestock(id);
            sent++;
            break;

          case 'low-stock-alert':
            await triggerLowStockAlert(id);
            sent++;
            break;

          default:
            failed++;
        }
      } catch (error) {
        console.error(`Failed to send email for ${id}:`, error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
    });
  } catch (error) {
    console.error('Send emails error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
