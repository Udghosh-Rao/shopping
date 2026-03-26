'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  User, MapPin, Package, Heart, LogOut, Loader2, Edit2,
} from 'lucide-react';
import OrderTracker from '@/components/ui/OrderTracker';

interface Order {
  _id: string;
  items: { name: string; image: string; size: string; quantity: number; price: number }[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

function ProfileContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(tabParam || 'profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      fetch('/api/orders')
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'Shipped': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'Delivered': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-28">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xl font-bold overflow-hidden">
          {session?.user?.image ? (
            <Image src={session.user.image} alt="" width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            session?.user?.name?.[0]?.toUpperCase() || 'U'
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{session?.user?.name || 'User'}</h1>
          <p className="text-sm text-muted">{session?.user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 border-b border-[var(--border)] pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
              activeTab === tab.id ? 'text-foreground' : 'text-muted hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Name</label>
                <p className="font-medium">{session?.user?.name || '—'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Email</label>
                <p className="font-medium">{session?.user?.email || '—'}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-accent font-medium border border-accent rounded-xl hover:bg-accent hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Saved Addresses</h2>
              <button className="flex items-center gap-1.5 text-sm text-accent font-medium hover:underline">
                <Edit2 className="w-3.5 h-3.5" />
                Add New
              </button>
            </div>
            <div className="text-center py-12 text-muted">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No saved addresses yet</p>
              <p className="text-sm">Add an address during checkout and it will appear here</p>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted" />
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center py-12">
                <Package className="w-10 h-10 mx-auto mb-3 text-muted opacity-40" />
                <p className="text-muted mb-4">No orders yet</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-semibold rounded-xl"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-muted">Order ID</p>
                      <p className="text-sm font-mono">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Date</p>
                      <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-[var(--skeleton)] overflow-hidden flex-shrink-0 relative">
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted">Size: {item.size} × {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-[var(--border)]">
                    <OrderTracker status={order.orderStatus} />
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center">
                    <span className="text-sm text-muted">Total</span>
                    <span className="font-bold">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center py-12">
            <Heart className="w-10 h-10 mx-auto mb-3 text-muted opacity-40" />
            <p className="text-muted mb-4">Your wishlist is empty</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm font-semibold rounded-xl"
            >
              Browse Products
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-28">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[var(--skeleton)] animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-32 bg-[var(--skeleton)] animate-pulse rounded" />
            <div className="h-4 w-48 bg-[var(--skeleton)] animate-pulse rounded" />
          </div>
        </div>
        <div className="h-12 w-full bg-[var(--skeleton)] animate-pulse rounded mb-8" />
        <div className="h-64 w-full bg-[var(--skeleton)] animate-pulse rounded" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
