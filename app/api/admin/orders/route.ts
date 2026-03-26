import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { isMongoConfigured } from '@/lib/mongodb';
import { listDemoOrders } from '@/lib/demoBackend';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ orders: listDemoOrders() });
  }

  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders });
}
