import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { isMongoConfigured } from '@/lib/mongodb';
import { createDemoProduct, listDemoProducts } from '@/lib/demoBackend';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as Record<string, unknown>).role !== 'admin') {
    return false;
  }
  return true;
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  if (!isMongoConfigured()) {
    return NextResponse.json({ products: listDemoProducts() });
  }
  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const body = await req.json();

  if (!isMongoConfigured()) {
    const product = createDemoProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  }

  await dbConnect();

  try {
    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
