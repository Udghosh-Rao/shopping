"use client";

import { useEffect, useState } from "react";
import { getRecentlyViewed, type RecentlyViewedProduct } from "@/lib/recentlyViewed";
import ProductCard from "./ProductCard";

export default function RecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    void Promise.resolve().then(() => setProducts(getRecentlyViewed()));
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto border-t border-gray-100">
      <div className="mb-8 md:mb-10">
        <p className="text-[#E63946] text-xs font-bold tracking-[0.08em] mb-2">FOR YOU</p>
        <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[#0A0A0A]">Recently Viewed</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
