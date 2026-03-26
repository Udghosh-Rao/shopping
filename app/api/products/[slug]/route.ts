import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import User from '@/models/User';
import { getSampleProductBySlug } from '@/lib/sampleCatalog';
import mongoose from 'mongoose';

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

    const { searchParams } = new URL(req.url);
    const includeWishlist = searchParams.get('includeWishlist') === 'true';

    let isInWishlist = false;
    if (includeWishlist) {
      const session = await getServerSession(authOptions);
      if (session?.user) {
        const userId = (session.user as Record<string, unknown>).id as string;
        const user = await User.findById(
          new mongoose.Types.ObjectId(userId)
        ).lean();
        isInWishlist =
          user?.wishlist?.some(
            (id) => id.toString() === product._id.toString()
          ) || false;
      }
    }

    return NextResponse.json({ product: { ...product, isInWishlist }, related });
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
