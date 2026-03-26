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
  const [apiFailed, setApiFailed] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Men", "Women", "Sneakers"];

  useEffect(() => {
    void Promise.resolve().then(() => setLoading(true));
    const gender = activeFilter === "All" ? "" : activeFilter === "Sneakers" ? "" : activeFilter;
    const category = activeFilter === "Sneakers" ? "Shoes" : "";
    const params = new URLSearchParams();
    if (gender) params.set("gender", gender);
    if (category) params.set("category", category);
    // Ensure we actually request "new arrivals" from the API.
    params.set("newArrivals", "true");
    params.set("limit", "8");

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        const list = d.products || [];
        setProducts(list);
        setApiFailed(!list.length && !!d.error);
      })
      .catch(() => {
        setProducts([]);
        setApiFailed(true);
      })
      .finally(() => setLoading(false));
  }, [activeFilter]);

  return (
    <section className="py-14 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-10">
        <div>
          <p className="text-[#E63946] text-xs font-bold tracking-[0.3em] mb-2">JUST DROPPED</p>
          <RevealText text="NEW ARRIVALS" className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none" />
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
      ) : products.length > 0 ? (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product, i) => (
            <motion.div key={product._id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-[#F8F5F0] px-6 py-10 text-center">
          <p className="text-sm font-semibold text-[#0A0A0A]">
            {apiFailed ? "Products are loading from server. Please refresh in a moment." : "No products found for this filter."}
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <MagneticButton className="inline-block">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#0A0A0A] text-white font-black text-sm tracking-widest rounded-full hover:bg-[#E63946] transition-all duration-300 hover:gap-5"
          >
            VIEW ALL PRODUCTS
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </MagneticButton>
      </div>
    </section>
  );
}
