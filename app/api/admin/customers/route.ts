import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { isMongoConfigured } from '@/lib/mongodb';
import { listDemoCustomers } from '@/lib/demoBackend';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  if (!isMongoConfigured()) {
    return NextResponse.json({ customers: listDemoCustomers() });
  }

  await dbConnect();
  const customers = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ customers });
}
