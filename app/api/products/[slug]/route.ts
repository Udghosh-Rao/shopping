import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { getSampleProductBySlug } from '@/lib/sampleCatalog';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get related products (same category, different product)
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(4)
      .lean();

    return NextResponse.json({ product, related });
  } catch (error) {
    console.error('Product API error:', error);
    const { slug } = await params;
    const fallback = getSampleProductBySlug(slug);
    if (!fallback.product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(fallback);
  }
}
