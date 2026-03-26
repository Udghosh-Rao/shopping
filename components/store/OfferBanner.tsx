"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import RevealText from "@/components/ui/RevealText";

export default function OfferBanner() {
  return (
    <section className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-[#0A0A0A] rounded-3xl overflow-hidden px-8 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-white font-black text-9xl select-none"
              style={{ top: `${(i % 2) * 60}%`, left: `${i * 18}%`, transform: "rotate(-15deg)" }}
            >
              %
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={16} className="text-[#E63946]" />
            <span className="text-[#E63946] text-xs font-bold tracking-[0.3em]">LIMITED TIME</span>
          </div>
          <RevealText
            text="UP TO 50% OFF"
            className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight"
          />
          <p className="text-gray-400 mt-2 text-sm">
            Use code <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-md">DRIP50</span> at checkout
          </p>
        </div>

        <MagneticButton className="relative z-10">
          <Link
            href="/shop?filter=sale"
            className="group flex items-center gap-3 px-8 py-4 bg-[#E63946] text-white font-black text-sm tracking-widest rounded-xl hover:bg-red-700 transition-colors flex-shrink-0"
          >
            SHOP SALE
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </MagneticButton>
      </motion.div>
    </section>
  );
}
