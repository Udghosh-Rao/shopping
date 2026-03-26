import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { isMongoConfigured } from '@/lib/mongodb';
import { updateDemoProduct, deleteDemoProduct } from '@/lib/demoBackend';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user && (session.user as Record<string, unknown>).role === 'admin';
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id } = await params;
    const body = await req.json();
    if (!isMongoConfigured()) {
      const product = updateDemoProduct(id, body);
      if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ product });
    }

    await dbConnect();
    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id } = await params;
    if (!isMongoConfigured()) {
      const ok = deleteDemoProduct(id);
      if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ message: 'Product deleted' });
    }

    await dbConnect();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
