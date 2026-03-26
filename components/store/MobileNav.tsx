"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cartStore";

const tabs = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Grid, label: "Shop", href: "/shop" },
  { icon: Heart, label: "Wishlist", href: "/profile?tab=wishlist" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {tabs.map(({ icon: Icon, label, href }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);
          return (
            <Link key={label} href={href} className="relative flex flex-col items-center justify-center gap-1">
              {active && <motion.div layoutId="mobileNavBg" className="absolute top-1 w-10 h-10 bg-[#E63946]/10 rounded-2xl" />}
              <Icon size={19} className={`relative z-10 transition-colors ${active ? "text-[#E63946]" : "text-gray-400"}`} />
              <span
                className={`text-[9px] font-bold tracking-[0.08em] relative z-10 transition-colors ${
                  active ? "text-[#E63946]" : "text-gray-400"
                }`}
              >
                {label.toUpperCase()}
              </span>
            </Link>
          );
        })}

        <Link href="/cart" className="relative flex flex-col items-center justify-center gap-1">
          <div className="relative">
            <ShoppingBag size={19} className="text-gray-400" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#E63946] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black"
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="text-[9px] font-bold tracking-[0.08em] text-gray-400">BAG</span>
        </Link>
      </div>
    </div>
  );
}
