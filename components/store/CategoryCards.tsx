"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import RevealText from "@/components/ui/RevealText";

const categories = [
  {
    label: "MEN",
    sub: "T-Shirts, Hoodies, Joggers",
    href: "/shop?gender=Men",
    count: "500+ Styles",
    emoji: "👔",
    bg: "#0A0A0A",
    text: "#FFFFFF",
  },
  {
    label: "WOMEN",
    sub: "Tops, Co-ords, Dresses",
    href: "/shop?gender=Women",
    count: "400+ Styles",
    emoji: "👗",
    bg: "#F8F5F0",
    text: "#0A0A0A",
  },
  {
    label: "SNEAKERS",
    sub: "Fresh drops weekly",
    href: "/shop?category=Shoes",
    count: "Latest Drops",
    emoji: "👟",
    bg: "#E63946",
    text: "#FFFFFF",
  },
  {
    label: "SALE",
    sub: "Up to 50% off",
    href: "/shop?filter=sale",
    count: "Limited Time",
    emoji: "🔥",
    bg: "#FFF7ED",
    text: "#0A0A0A",
  },
];

export default function CategoryCards() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[#E63946] text-xs font-bold tracking-[0.3em] mb-2">BROWSE BY</p>
          <RevealText text="CATEGORIES" className="text-4xl md:text-5xl font-black tracking-tight leading-none" />
        </div>
        <Link
          href="/shop"
          className="hidden md:flex items-center gap-2 text-sm font-bold tracking-widest hover:text-[#E63946] transition-colors group"
        >
          ALL PRODUCTS
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Link
              href={cat.href}
              data-cursor="SHOP"
              className="group relative flex flex-col justify-between h-52 md:h-72 p-5 md:p-7 rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: cat.bg, color: cat.text }}
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-xs font-bold tracking-[0.2em] px-2.5 py-1 rounded-full"
                  style={{ background: `${cat.text}15`, color: cat.text }}
                >
                  {cat.count}
                </span>
                <motion.div whileHover={{ rotate: 45 }} transition={{ duration: 0.2 }}>
                  <ArrowUpRight size={20} style={{ color: cat.text, opacity: 0.5 }} className="group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>

              <div className="text-4xl md:text-5xl">{cat.emoji}</div>

              <div>
                <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-none mb-1" style={{ color: cat.text }}>
                  {cat.label}
                </h3>
                <p className="text-xs font-medium opacity-60" style={{ color: cat.text }}>
                  {cat.sub}
                </p>
              </div>

              <motion.div className="absolute bottom-0 left-0 h-1 bg-[#E63946]" initial={{ width: 0 }} whileHover={{ width: "100%" }} transition={{ duration: 0.3 }} />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
