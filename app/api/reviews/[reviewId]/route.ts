import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { rating, text } = await req.json();
    const userId = (session.user as Record<string, unknown>).id as string;
    const { reviewId } = await params;

    if (!rating || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const review = await Review.findById(
      new mongoose.Types.ObjectId(reviewId)
    );
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Check if userId matches
    if (review.userId.toString() !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this review' },
        { status: 403 }
      );
    }

    review.rating = rating;
    review.text = text;
    await review.save();

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
    });
  } catch (error) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { reviewId } = await params;
    const userId = (session.user as Record<string, unknown>).id as string;

    await dbConnect();

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    const review = await Review.findById(new mongoose.Types.ObjectId(reviewId));

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Allow deletion by review author or admin
    if (review.userId.toString() !== userId && user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to delete this review' },
        { status: 403 }
      );
    }

    await Review.deleteOne({ _id: new mongoose.Types.ObjectId(reviewId) });

    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await User.findById((session.user as Record<string, unknown>).id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { verified } = await req.json();
    const { reviewId } = await params;

    await dbConnect();

    const review = await Review.findById(
      new mongoose.Types.ObjectId(reviewId)
    );

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (verified !== undefined) {
      review.verified = verified;
    }

    await review.save();

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
    });
  } catch (error) {
    console.error('Patch review error:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
