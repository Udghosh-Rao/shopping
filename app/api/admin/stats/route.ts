import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { isMongoConfigured } from '@/lib/mongodb';
import { listDemoOrders, listDemoProducts, listDemoCustomers } from '@/lib/demoBackend';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as Record<string, unknown>).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!isMongoConfigured()) {
      const orders = listDemoOrders();
      const paid = orders.filter((o) => o.paymentStatus === 'paid');
      const totalSales = paid.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      const totalOrders = orders.length;
      const products = listDemoProducts();
      const totalProducts = products.length;
      const customers = listDemoCustomers();
      const totalCustomers = customers.length;
      const recentOrders = orders.slice(0, 10).map((o) => ({
        _id: o._id,
        totalAmount: o.totalAmount,
        orderStatus: o.orderStatus,
        createdAt: o.createdAt,
      }));
      return NextResponse.json({ totalSales, totalOrders, totalProducts, totalCustomers, recentOrders });
    }

    await dbConnect();

    const [salesResult, totalOrders, totalProducts, totalCustomers, recentOrders] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Order.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return NextResponse.json({
      totalSales: salesResult[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
