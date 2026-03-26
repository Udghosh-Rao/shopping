'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  // Calculate estimated delivery (5-7 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5 + Math.floor(Math.random() * 3));
  const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', damping: 12 }}
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl sm:text-4xl font-bold mb-3"
      >
        Order Placed! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-muted text-lg mb-8"
      >
        Thank you for shopping with UrbanDrip
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 mb-8 text-left space-y-4"
      >
        {orderId && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Order ID</span>
            <span className="text-sm font-mono font-medium">{orderId}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Estimated Delivery</span>
          <span className="text-sm font-medium">{formattedDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Status</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-lg">
            <Package className="w-3 h-3" />
            Processing
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-foreground text-background font-semibold rounded-xl hover:bg-accent hover:text-white transition-colors"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/profile?tab=orders"
          className="inline-flex items-center gap-2 px-8 py-3.5 border border-[var(--border)] font-semibold rounded-xl hover:bg-[var(--input-bg)] transition-colors"
        >
          View Orders
        </Link>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[var(--skeleton)] animate-pulse" />
        <div className="h-8 w-64 mx-auto mb-4 bg-[var(--skeleton)] animate-pulse rounded" />
        <div className="h-6 w-48 mx-auto bg-[var(--skeleton)] animate-pulse rounded" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
