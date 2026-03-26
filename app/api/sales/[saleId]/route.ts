import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ saleId: string }> }
) {
  try {
    await dbConnect();

    const { saleId } = await params;

    const sale = await Sale.findById(
      new mongoose.Types.ObjectId(saleId)
    ).lean();

    if (!sale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    // Get products in this sale
    const products = await Product.find({
      _id: { $in: sale.productIds },
    }).lean();

    return NextResponse.json({ sale, products });
  } catch (error) {
    console.error('Get sale details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sale details' },
      { status: 500 }
    );
  }
}
