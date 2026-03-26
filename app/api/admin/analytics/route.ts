import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;

  await dbConnect();
  const user = await User.findById((session.user as Record<string, unknown>).id);
  return user && user.role === 'admin';
}

export async function GET(req: NextRequest) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get daily revenue for last 30 days
    const dailyRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          paymentStatus: 'paid',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get top products
    const topProductsAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: 'paid',
        },
      },
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      {
        $sort: { revenue: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    // Get low stock products (stock < 5)
    const stockAlerts = await Product.find({
      $or: [
        { stock: { $lt: 5 } },
        { 'sizes.stock': { $lt: 5 } },
      ],
    }).select('_id name stock sizes').limit(10);

    // Calculate conversion metrics
    const totalVisitors = await User.countDocuments();
    const totalCheckouts = await Order.countDocuments({ paymentStatus: { $in: ['pending', 'paid'] } });
    const totalOrders = await Order.countDocuments({ paymentStatus: 'paid' });

    const conversionMetrics = {
      visitors: totalVisitors,
      carts: totalVisitors > 0 ? Math.floor(totalVisitors * 0.15) : 0,
      checkouts: totalCheckouts,
      orders: totalOrders,
      conversionRate: totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(2) : '0.00',
    };

    return NextResponse.json({
      dailyRevenue: dailyRevenueAgg.map((item) => ({
        date: item._id,
        revenue: item.revenue,
        orders: item.orders,
      })),
      topProducts: topProductsAgg,
      stockAlerts: stockAlerts.map((p) => ({
        productId: p._id,
        name: p.name,
        stock: p.stock,
        lowStockSizes: p.sizes.filter((s: { size: string; stock: number }) => s.stock < 5),
      })),
      conversionMetrics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
