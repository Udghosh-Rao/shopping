'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/lib/cartStore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import RecentlyViewed from '@/components/store/RecentlyViewed';

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const deliveryCharge = totalPrice > 999 ? 0 : 99;
  const finalTotal = totalPrice - discount + deliveryCharge;

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Enter a coupon code');
      return;
    }

    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderAmount: totalPrice }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Invalid coupon code');
        setDiscount(0);
      } else {
        setDiscount(data.discount);
        toast.success(`₹${data.discount} discount applied! 🎉`);
      }
    } catch {
      toast.error('Failed to apply coupon');
      setDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--input-bg)] flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-foreground text-background font-semibold rounded-xl hover:bg-accent hover:text-white transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-28">
      <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
      <p className="text-muted text-sm mb-8">{totalItems} item{totalItems > 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.size}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="flex gap-4 p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl"
              >
                {/* Image */}
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--skeleton)]"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-medium text-sm sm:text-base hover:text-accent transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted mt-0.5">Size: {item.size}</p>

                  <div className="flex items-center gap-2 mt-2">
                    {item.discountPrice ? (
                      <>
                        <span className="font-bold text-sm">
                          ₹{item.discountPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted line-through">
                          ₹{item.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-sm">
                        ₹{item.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center border border-[var(--border)] rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--input-bg)] transition-colors rounded-l-lg"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.size, Math.min(10, item.quantity + 1))
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--input-bg)] transition-colors rounded-r-lg"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="p-2 text-muted hover:text-accent transition-colors rounded-lg hover:bg-[var(--input-bg)]"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={clearCart}
            className="text-sm text-muted hover:text-accent transition-colors underline"
          >
            Clear entire cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold">Order Summary</h2>

            {/* Coupon */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="ENTER COUPON CODE"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--input-bg)] border-2 border-dashed border-[var(--input-border)] rounded-xl text-sm font-bold tracking-widest focus:outline-none focus:border-[#0A0A0A] uppercase"
                />
              </div>
              <button
                onClick={applyCoupon}
                disabled={couponLoading}
                className="px-4 py-2.5 bg-foreground text-background text-sm font-semibold rounded-xl hover:bg-accent transition-colors disabled:opacity-60"
              >
                {couponLoading ? '...' : 'APPLY'}
              </button>
            </div>

            <div className="border-t border-[var(--border)] pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-muted">
                  Free delivery on orders above ₹999
                </p>
              )}
            </div>

            <div className="border-t border-[var(--border)] pt-4 flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">₹{finalTotal.toLocaleString()}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full py-3.5 bg-accent text-white font-semibold rounded-xl text-center hover:bg-accent-hover transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>

      <RecentlyViewed />
    </div>
  );
}
