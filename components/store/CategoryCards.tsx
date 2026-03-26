"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    label: "SHOP MEN",
    href: "/shop?gender=Men",
    image: "/next.svg",
    tag: "500+ Styles",
  },
  {
    label: "SHOP WOMEN",
    href: "/shop?gender=Women",
    image: "/vercel.svg",
    tag: "400+ Styles",
  },
  {
    label: "SNEAKERS",
    href: "/shop?category=Shoes",
    image: "/globe.svg",
    tag: "Latest Drops",
  },
];

export default function CategoryCards() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <Link href={cat.href} className="group block relative h-[500px] overflow-hidden rounded-lg bg-[#F8F5F0]">
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/70 text-xs tracking-widest mb-1">{cat.tag}</p>
                <h3 className="text-white text-2xl font-black tracking-wider mb-3">{cat.label}</h3>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "40px" }}
                  viewport={{ once: true }}
                  className="h-0.5 bg-[#E63946]"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
