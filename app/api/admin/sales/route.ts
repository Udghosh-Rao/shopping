import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
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

    const { name, startTime, endTime, discountPercent, discountType, productIds } =
      await req.json();

    if (
      !name ||
      !startTime ||
      !endTime ||
      discountPercent === undefined ||
      !discountType ||
      !productIds
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const sale = await Sale.create({
      name,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      discountPercent,
      discountType,
      productIds: productIds.map((id: string) => new mongoose.Types.ObjectId(id)),
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        saleId: sale._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create sale error:', error);
    return NextResponse.json(
      { error: 'Failed to create sale' },
      { status: 500 }
    );
  }
}
