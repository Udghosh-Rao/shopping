import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { filterSampleProducts } from '@/lib/sampleCatalog';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const size = searchParams.get('size');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');
    const newArrivals = searchParams.get('newArrivals');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build filter
    const filter: Record<string, unknown> = {};

    if (gender) filter.gender = gender;
    if (category) filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (newArrivals === 'true') filter.isNewArrival = true;
    if (size) filter['sizes.size'] = size;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = parseInt(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = parseInt(maxPrice);
    }

    // Build sort
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price-low') sortObj = { price: 1 };
    else if (sort === 'price-high') sortObj = { price: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    // Fallback so the homepage UI doesn't go blank if MongoDB isn't configured.
    const { searchParams } = new URL(req.url);
    const query = {
      gender: searchParams.get('gender'),
      category: searchParams.get('category'),
      featured: searchParams.get('featured') === 'true',
      newArrivals: searchParams.get('newArrivals') === 'true',
      size: searchParams.get('size'),
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice') as string) : null,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice') as string) : null,
      sort: searchParams.get('sort'),
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
    };
    const fallback = filterSampleProducts(query);
    return NextResponse.json(fallback);
  }
}
