import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' }, name: 1, slug: 1, images: 1, price: 1, discountPrice: 1 }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(6)
      .lean();

    // Fallback to regex if text search finds nothing
    if (products.length === 0) {
      const regexProducts = await Product.find(
        { name: { $regex: q, $options: 'i' } },
        { name: 1, slug: 1, images: 1, price: 1, discountPrice: 1 }
      )
        .limit(6)
        .lean();
      return NextResponse.json({ products: regexProducts });
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ products: [] });
  }
}
