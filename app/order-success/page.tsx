"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle, Package, Home } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cartStore";

function OrderSuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [isValidOrder, setIsValidOrder] = useState<boolean | null>(null);

  useEffect(() => {
    if (!orderId) {
      setIsValidOrder(false);
      return;
    }

    // Validate order exists (simple check - order ID format validation)
    // In production, you'd make an API call to verify the order belongs to the current user
    if (typeof orderId === 'string' && orderId.length > 0) {
      setIsValidOrder(true);
      clearCart();
      try {
        localStorage.removeItem('coupon_discount');
        localStorage.removeItem('coupon_code');
      } catch {
        // ignore
      }
    } else {
      setIsValidOrder(false);
    }
  }, [orderId, clearCart]);

  // Redirect invalid orders
  if (isValidOrder === false) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-xl">
          <h1 className="text-3xl font-black mb-4">Order Not Found</h1>
          <p className="text-gray-500 mb-8">We couldn't find this order. Please check the link or contact support.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#E63946] text-white font-bold rounded-2xl hover:bg-red-700 transition-colors"
          >
            <Home size={16} /> BACK TO HOME
          </Link>
        </div>
      </div>
    );
  }

  if (isValidOrder === null) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E63946]"></div>
          <p className="mt-4 text-gray-500">Verifying order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-3xl p-8 md:p-12 max-w-lg w-full text-center shadow-xl relative"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-500" />
        </motion.div>

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              x: [(i % 2 === 0 ? -1 : 1) * (30 + i * 10), 0],
              y: [-50 - i * 10, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? "#E63946" : "#0A0A0A",
              left: "50%",
              top: "30%",
            }}
          />
        ))}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <p className="text-[#E63946] text-xs font-bold tracking-[0.3em] mb-2">ORDER CONFIRMED</p>
          <h1 className="text-4xl font-black tracking-tight mb-3">YOU&apos;RE ALL SET! 🎉</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Your order has been placed and is being processed. You&apos;ll receive a confirmation email shortly.
          </p>

          <div className="bg-[#F8F5F0] rounded-2xl p-5 mb-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-[#0A0A0A] rounded-xl flex items-center justify-center flex-shrink-0">
              <Package size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-black text-sm">Estimated Delivery</p>
              <p className="text-gray-500 text-sm">5–7 business days</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/profile"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-[#0A0A0A] font-bold text-sm rounded-2xl hover:bg-[#0A0A0A] hover:text-white transition-all"
            >
              <Package size={16} /> TRACK ORDER
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#E63946] text-white font-bold text-sm rounded-2xl hover:bg-red-700 transition-colors"
            >
              <Home size={16} /> KEEP SHOPPING
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E63946]"></div>
          <p className="mt-4 text-gray-500">Loading order...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
