"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X, Heart, Zap } from "lucide-react";
import { useCart } from "@/lib/cartStore";

const navLinks = [
  { label: "MEN", href: "/shop?gender=Men" },
  { label: "WOMEN", href: "/shop?gender=Women" },
  { label: "SNEAKERS", href: "/shop?category=Shoes" },
  { label: "OVERSIZED", href: "/shop?category=T-Shirts" },
  { label: "🔥 SALE", href: "/shop?filter=sale" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ slug: string; images: string[]; name: string; discountPrice?: number; price: number }[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSearchResults(data.products || []);
      } catch {
        setSearchResults([]);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  return (
    <>
      <div className="bg-[#E63946] text-white text-center text-[11px] py-2 font-bold tracking-[0.25em]">
        🚀 FREE SHIPPING ABOVE ₹599 &nbsp;|&nbsp; USE CODE{" "}
        <span className="bg-white text-[#E63946] px-1.5 py-0.5 rounded font-black">DRIP50</span>
        &nbsp;FOR 50% OFF
      </div>

      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100" : "bg-white"
        }`}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <button className="md:hidden p-2 -ml-2" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>

            <Link href="/" className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-[#E63946] rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="text-xl font-black tracking-tight">
                DRIP<span className="text-[#E63946]">STORE</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 text-xs font-bold tracking-widest text-gray-600 hover:text-[#0A0A0A] transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E63946] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Toggle search"
              >
                <Search size={19} />
              </button>
              <Link href="/profile" className="p-2 rounded-xl hover:bg-gray-100 transition-colors hidden md:block">
                <User size={19} />
              </Link>
              <Link href="/profile?tab=wishlist" className="p-2 rounded-xl hover:bg-gray-100 transition-colors hidden md:block">
                <Heart size={19} />
              </Link>
              <Link href="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <ShoppingBag size={19} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-[#E63946] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black"
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
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
              className="border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 relative">
                <div className="flex items-center gap-3 border-b-2 border-[#E63946] pb-2">
                  <Search size={18} className="text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tees, sneakers, hoodies..."
                    className="flex-1 text-base outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")}>
                      <X size={16} className="text-gray-400" />
                    </button>
                  )}
                </div>
                {searchResults.length > 0 && (
                  <div className="absolute left-4 right-4 md:left-8 md:right-8 bg-white border border-gray-100 rounded-2xl shadow-2xl mt-2 overflow-hidden z-50">
                    {searchResults.slice(0, 5).map((p) => (
                      <Link
                        key={p.slug}
                        href={`/product/${p.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F5F0] transition-colors"
                      >
                        {p.images[0] && <img src={p.images[0]} className="w-10 h-12 object-cover rounded-lg" alt="" />}
                        <div>
                          <p className="text-sm font-semibold">{p.name}</p>
                          <p className="text-xs text-[#E63946] font-bold">₹{p.discountPrice || p.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {!searchQuery && (
                  <div className="pt-3">
                    <p className="text-xs font-bold tracking-widest text-gray-400 mb-2">TRENDING</p>
                    <div className="flex flex-wrap gap-2">
                      {["oversized tee", "anime tshirt", "sneakers", "hoodies", "sale"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3 py-1.5 bg-gray-100 text-xs font-semibold rounded-full hover:bg-[#E63946] hover:text-white transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[70] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <span className="text-lg font-black">
                  DRIP<span className="text-[#E63946]">STORE</span>
                </span>
                <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-[#F8F5F0] font-bold text-lg tracking-tight transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t space-y-2">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F5F0] font-semibold transition-colors"
                  >
                    <User size={18} /> My Profile
                  </Link>
                  <Link
                    href="/profile?tab=wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#F8F5F0] font-semibold transition-colors"
                  >
                    <Heart size={18} /> Wishlist
                  </Link>
                </div>
              </div>
              <div className="p-5 border-t">
                <p className="text-xs text-gray-400 font-medium text-center">Made with ❤️ in India 🇮🇳</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
