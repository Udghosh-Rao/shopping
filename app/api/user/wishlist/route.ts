import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    await dbConnect();

    const user = await User.findById(new mongoose.Types.ObjectId(userId))
      .populate('wishlist')
      .lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return both items and products for component compatibility
    return NextResponse.json({ 
      items: user.wishlist || [],
      products: user.wishlist || []
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { productId, action } = await req.json();
    const userId = (session.user as Record<string, unknown>).id as string;

    if (!productId || !action || (action !== 'add' && action !== 'remove')) {
      return NextResponse.json(
        { error: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    if (action === 'add') {
      await User.updateOne(
        { _id: userObjectId },
        { $addToSet: { wishlist: productObjectId } }
      );
    } else {
      await User.updateOne(
        { _id: userObjectId },
        { $pull: { wishlist: productObjectId } }
      );
    }

    const user = await User.findById(userObjectId).lean();
    const wishlistCount = (user?.wishlist as any[])?.length || 0;

    return NextResponse.json({
      success: true,
      wishlistCount,
    });
  } catch (error) {
    console.error('Update wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}
