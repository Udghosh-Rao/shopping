import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();

    // Filter sales where startTime <= now <= endTime
    const sales = await Sale.find({
      startTime: { $lte: now },
      endTime: { $gte: now },
      isActive: true,
    })
      .lean();

    // Get product count for each sale
    const salesWithCount = await Promise.all(
      sales.map(async (sale) => {
        const productCount = sale.productIds.length;
        return {
          id: sale._id,
          name: sale.name,
          discount: sale.discountPercent,
          discountType: sale.discountType,
          endTime: sale.endTime,
          productCount,
        };
      })
    );

    return NextResponse.json({ sales: salesWithCount });
  } catch (error) {
    console.error('Get sales error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}
