"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import RevealText from "@/components/ui/RevealText";
import MagneticButton from "@/components/ui/MagneticButton";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  gender: string;
  isNewArrival?: boolean;
  isSoldOut?: boolean;
  sizes?: { size: string; stock: number }[];
}

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Men", "Women", "Sneakers"];

  useEffect(() => {
    setLoading(true);
    const gender = activeFilter === "All" ? "" : activeFilter === "Sneakers" ? "" : activeFilter;
    const category = activeFilter === "Sneakers" ? "Shoes" : "";
    const params = new URLSearchParams();
    if (gender) params.set("gender", gender);
    if (category) params.set("category", category);
    params.set("limit", "8");

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeFilter]);

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-[#E63946] text-xs font-bold tracking-[0.3em] mb-2">JUST DROPPED</p>
          <RevealText text="NEW ARRIVALS" className="text-4xl md:text-5xl font-black tracking-tight leading-none" />
        </div>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="relative px-5 py-2 text-xs font-bold tracking-widest rounded-full transition-all duration-200"
              style={{
                background: activeFilter === f ? "#0A0A0A" : "transparent",
                color: activeFilter === f ? "#FFFFFF" : "#6B7280",
                border: activeFilter === f ? "2px solid #0A0A0A" : "2px solid #E5E7EB",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 rounded-2xl" />
              <div className="mt-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-16" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product, i) => (
            <motion.div key={product._id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mt-12 text-center">
        <MagneticButton className="inline-block">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 px-10 py-4 border-2 border-[#0A0A0A] font-bold text-sm tracking-widest hover:bg-[#0A0A0A] hover:text-white transition-all duration-300"
          >
            VIEW ALL PRODUCTS
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </MagneticButton>
      </div>
    </section>
  );
}
