"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import RevealText from "@/components/ui/RevealText";

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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [apiFailed, setApiFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/products?featured=true&limit=10")
      .then((r) => r.json())
      .then((d) => {
        const list = d.products || [];
        setProducts(list);
        setApiFailed(!list.length && !!d.error);
      })
      .catch(() => {
        setProducts([]);
        setApiFailed(true);
      });
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
    }
  };

  if (!products.length) {
    if (!apiFailed) return null;
    return (
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-dashed border-gray-200 bg-[#F8F5F0] px-6 py-10 text-center">
          <p className="text-sm font-semibold text-[#0A0A0A]">Trending products are temporarily unavailable.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[#E63946] text-xs font-bold tracking-[0.3em] mb-2">HANDPICKED FOR YOU</p>
          <RevealText text="TRENDING NOW" className="text-4xl md:text-5xl font-black tracking-tight leading-none" delay={0.1} />
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#0A0A0A] transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#E63946] transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 will-change-transform"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((product) => (
          <div key={product._id} className="flex-shrink-0 w-[48%] sm:w-[42%] md:w-64" style={{ scrollSnapAlign: "start" }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
