'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  userId: string;
  items: { name: string; size: string; quantity: number; price: number }[];
  shippingAddress: { fullName: string; city: string; state: string };
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      });
      if (res.ok) {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
      }
    } catch { toast.error('Failed to update status'); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Shipped': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'Delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-muted';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted">{orders.length} orders</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted" /></div>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center py-12 text-muted">No orders yet</div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-5 font-semibold text-muted">Order ID</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Customer</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Amount</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Payment</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Status</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted">Date</th>
                  <th className="text-right py-3 px-5 font-semibold text-muted">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-[var(--border)] last:border-0"
                  >
                    <td className="py-3 px-5 font-mono text-xs">{order._id.slice(-8)}</td>
                    <td className="py-3 px-5">
                      <p className="font-medium">{order.shippingAddress.fullName}</p>
                      <p className="text-xs text-muted">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    </td>
                    <td className="py-3 px-5 font-medium">₹{order.totalAmount.toLocaleString()}</td>
                    <td className={`py-3 px-5 font-medium capitalize ${getPaymentColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-5">
                      <div className="flex justify-end">
                        <div className="relative">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            className="appearance-none pr-8 pl-3 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-xs focus:outline-none focus:border-accent cursor-pointer"
                          >
                            {statusOptions.map((s) => <option key={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none" />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
