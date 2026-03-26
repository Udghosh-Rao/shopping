import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { isMongoConfigured } from '@/lib/mongodb';
import { updateDemoOrder } from '@/lib/demoBackend';
import type { DemoOrder } from '@/lib/demoBackend';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = (await req.json()) as Partial<DemoOrder>;
    if (!isMongoConfigured()) {
      const order = updateDemoOrder(id, body);
      if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ order });
    }

    await dbConnect();
    const order = await Order.findByIdAndUpdate(id, body, { new: true });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
