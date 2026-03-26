"use client";

import { useEffect, useState } from "react";
import { getRecentlyViewed, type RecentlyViewedProduct } from "@/lib/recentlyViewed";
import ProductCard from "./ProductCard";

export default function RecentlyViewed() {
  const [products, setProducts] = useState<RecentlyViewedProduct[]>([]);

  useEffect(() => {
    setProducts(getRecentlyViewed());
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <h3 className="text-2xl font-black tracking-tight mb-6">RECENTLY VIEWED 👀</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
