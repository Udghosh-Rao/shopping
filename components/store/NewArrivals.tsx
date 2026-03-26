"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category?: string;
  gender?: string;
  isNewArrival?: boolean;
  isSoldOut?: boolean;
  stock?: number;
  sizes?: { size: string; stock: number }[];
}

export default function NewArrivals({ products }: { products?: Product[] }) {
  const mockProducts: Product[] = [
    {
      _id: "m1",
      name: "Demon Slayer: Tanjiro Kamado",
      slug: "demon-slayer-tanjiro",
      price: 1699,
      images: ["/next.svg", "/vercel.svg"],
      category: "Shirts",
      isNewArrival: true,
    },
    {
      _id: "m2",
      name: "Marvel: It's Rocket",
      slug: "marvel-rocket",
      price: 999,
      discountPrice: 799,
      images: ["/next.svg"],
      category: "T-Shirts",
      isNewArrival: true,
    },
    {
      _id: "m3",
      name: "Kanso ZE: Beige",
      slug: "kanso-ze-beige",
      price: 2599,
      images: ["/next.svg", "/vercel.svg"],
      category: "Sneakers",
    },
    {
      _id: "m4",
      name: "Linkin Park: Logo White",
      slug: "linkin-park-logo",
      price: 899,
      images: ["/next.svg"],
      category: "T-Shirts",
    },
    {
      _id: "m5",
      name: "Korean Joggers: Mocha",
      slug: "korean-joggers-mocha",
      price: 1299,
      images: ["/next.svg"],
      category: "Joggers",
      isNewArrival: true,
    },
    {
      _id: "m6",
      name: "Batman: Rage",
      slug: "batman-rage",
      price: 1799,
      discountPrice: 1299,
      images: ["/next.svg"],
      category: "Shirts",
    },
    {
      _id: "m7",
      name: "NASA: Grey Logo",
      slug: "nasa-grey",
      price: 999,
      images: ["/next.svg"],
      category: "T-Shirts",
    },
    {
      _id: "m8",
      name: "Iron Man Arc Reactor",
      slug: "iron-man-arc",
      price: 3499,
      images: ["/next.svg"],
      category: "Sneakers",
      isNewArrival: true,
    },
  ];

  const items = products && products.length > 0 ? products : mockProducts;

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[#E63946] text-sm font-bold tracking-widest mb-2"
          >
            JUST DROPPED
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            NEW ARRIVALS
          </motion.h2>
        </div>
        <Link
          href="/shop?sort=newest"
          className="hidden md:block text-sm font-bold tracking-widest underline underline-offset-4 hover:text-[#E63946] transition-colors"
        >
          VIEW ALL →
        </Link>
      </div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </motion.div>

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/shop?sort=newest"
          className="inline-block border-2 border-[#0A0A0A] px-8 py-3 font-bold text-sm tracking-widest hover:bg-[#0A0A0A] hover:text-white transition-all"
        >
          VIEW ALL PRODUCTS
        </Link>
      </div>
    </section>
  );
}
