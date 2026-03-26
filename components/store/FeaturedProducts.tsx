'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: { size: string; stock: number }[];
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  category?: string;
  gender?: string;
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-accent">Trending</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Featured Picks
            </h2>
          </motion.div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--input-bg)] transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--input-bg)] transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 snap-x snap-mandatory"
        style={{ scrollPaddingLeft: '1rem' }}
      >
        {/* Left spacer for max-w-7xl alignment */}
        <div className="flex-shrink-0 w-0 lg:w-[calc((100vw-80rem)/2)]" />

        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] snap-start"
          >
            <ProductCard product={product} index={i} />
          </motion.div>
        ))}

        {/* View All Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] snap-start"
        >
          <Link
            href="/shop"
            className="block h-full min-h-[360px] rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-accent/50 transition-all duration-300 flex items-center justify-center group"
          >
            <div className="text-center p-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <ChevronRight className="w-6 h-6 text-accent group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="font-semibold text-sm">View All Products</p>
              <p className="text-muted text-xs mt-1">Explore full collection</p>
            </div>
          </Link>
        </motion.div>

        <div className="flex-shrink-0 w-4" />
      </div>
    </section>
  );
}
