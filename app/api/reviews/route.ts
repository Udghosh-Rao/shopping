import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Order from '@/models/Order';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { productId, rating, text } = await req.json();
    const userId = (session.user as Record<string, unknown>).id as string;

    if (!productId || !rating || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Check if user purchased this product
    const order = await Order.findOne({
      userId: userObjectId,
      'items.productId': productObjectId,
    }).lean();

    const verified = !!order;

    // Create review
    const review = await Review.create({
      productId: productObjectId,
      userId: userObjectId,
      rating,
      text,
      verified,
    });

    return NextResponse.json(
      {
        success: true,
        reviewId: review._id,
        message: verified
          ? 'Review submitted successfully'
          : 'Review submitted but not verified (purchase not found)',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Get reviews sorted by helpful count (descending)
    const reviews = await Review.find({ productId: productObjectId })
      .sort({ helpful: -1, createdAt: -1 })
      .populate('userId', 'name')
      .lean();

    // Calculate average rating and count
    const allReviews = await Review.find({ productId: productObjectId }).lean();
    const avgRating =
      allReviews.length > 0
        ? (
            allReviews.reduce((sum, r) => sum + r.rating, 0) /
            allReviews.length
          ).toFixed(2)
        : 0;
    const totalCount = allReviews.length;

    // Remove user email, only keep name
    const sanitizedReviews = reviews.map((review) => ({
      ...review,
      userId: {
        name: (review.userId as any)?.name || 'Anonymous',
      },
    }));

    return NextResponse.json({
      reviews: sanitizedReviews,
      avgRating: parseFloat(avgRating as string),
      totalCount,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
