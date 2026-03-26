import { getServerSession } from 'next-auth';
import { NextResponse, NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
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

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: Record<string, unknown> = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        (query.createdAt as Record<string, Date>).$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        (query.createdAt as Record<string, Date>).$lte = end;
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('userId', 'email name');

    // Generate CSV
    const csvRows: string[] = [];
    csvRows.push(
      ['Order ID', 'Date', 'Customer', 'Email', 'Items', 'Total', 'Status', 'Payment', 'COD'].join(',')
    );

    orders.forEach((order) => {
      const itemsStr = order.items
        .map((item: { name: string; quantity: number; size: string }) => `${item.name}(${item.size})x${item.quantity}`)
        .join('; ');

      const userRef = order.userId as unknown as { name?: string; email?: string };

      const csvRow = [
        order._id.toString(),
        new Date(order.createdAt).toLocaleDateString(),
        userRef?.name || 'N/A',
        userRef?.email || 'N/A',
        `"${itemsStr}"`,
        order.totalAmount,
        order.orderStatus,
        order.paymentStatus,
        order.isCOD ? 'Yes' : 'No',
      ].join(',');

      csvRows.push(csvRow);
    });

    const csvContent = csvRows.join('\n');
    const filename = `orders_${startDate || 'all'}_${endDate || 'all'}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
