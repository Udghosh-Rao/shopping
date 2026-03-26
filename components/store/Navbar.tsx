"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X, Heart } from "lucide-react";
import { useCart } from "@/lib/cartStore";

const navLinks = [
  { label: "MEN", href: "/shop?gender=Men" },
  { label: "WOMEN", href: "/shop?gender=Women" },
  { label: "SNEAKERS", href: "/shop?category=Shoes" },
  { label: "NEW DROPS", href: "/shop?sort=newest" },
  { label: "SALE", href: "/shop", color: "text-[#E63946]" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-[#0A0A0A] text-white text-center text-xs py-2 tracking-widest">
          FREE SHIPPING ON ORDERS ABOVE ₹599 🚀
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="text-2xl font-black tracking-tight">
              DRIP<span className="text-[#E63946]">STORE</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-semibold tracking-widest hover:text-[#E63946] transition-colors ${
                    link.color || "text-[#0A0A0A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setSearchOpen(!searchOpen)} aria-label="Open search">
                <Search size={20} className="hover:text-[#E63946] transition-colors" />
              </button>
              <Link href="/profile" aria-label="Profile">
                <User size={20} className="hover:text-[#E63946] transition-colors" />
              </Link>
              <Link href="/profile?tab=wishlist" aria-label="Wishlist">
                <Heart size={20} className="hover:text-[#E63946] transition-colors" />
              </Link>
              <Link href="/cart" className="relative" aria-label="Cart">
                <ShoppingBag size={20} className="hover:text-[#E63946] transition-colors" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-[#E63946] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 bg-white px-4 md:px-8 py-4"
            >
              <input
                autoFocus
                type="text"
                placeholder="Search for t-shirts, shoes, hoodies..."
                className="w-full text-lg outline-none border-b-2 border-[#E63946] pb-2 bg-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-20 px-6"
          >
            <div className="flex flex-col gap-6 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl font-bold tracking-widest ${
                    link.color || "text-[#0A0A0A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
