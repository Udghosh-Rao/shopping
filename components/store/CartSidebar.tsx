"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartStore";

export default function CartSidebar() {
  const [open, setOpen] = useState(false);
  const { items, totalPrice } = useCart();

  useEffect(() => {
    const handleToggle = () => setOpen((p) => !p);
    const handleOpen = () => setOpen(true);

    window.addEventListener("toggle-cart-sidebar", handleToggle as EventListener);
    window.addEventListener("open-cart-sidebar", handleOpen as EventListener);

    return () => {
      window.removeEventListener("toggle-cart-sidebar", handleToggle as EventListener);
      window.removeEventListener("open-cart-sidebar", handleOpen as EventListener);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[80]"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[90] shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-black tracking-tight text-lg">YOUR BAG</h3>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                  <ShoppingBag className="w-10 h-10 mb-3" />
                  <p className="font-semibold">Your bag is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="border border-gray-100 rounded-xl p-3">
                    <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Size {item.size} · Qty {item.quantity}</p>
                    <p className="text-sm font-black text-[#E63946] mt-1">₹{(item.discountPrice || item.price).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-5 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Subtotal</span>
                <span className="font-black">₹{totalPrice.toLocaleString()}</span>
              </div>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="block w-full py-3 text-center bg-[#0A0A0A] text-white rounded-xl font-black tracking-widest text-sm hover:bg-[#E63946] transition-colors"
              >
                GO TO CART
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
