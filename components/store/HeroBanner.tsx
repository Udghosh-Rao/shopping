"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <p className="text-[#E63946] text-xs font-bold tracking-[0.12em] mb-3">NEW SEASON</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.02] tracking-tight">
              Clean Style.
              <br />
              Bold Comfort.
            </h1>
            <p className="text-sm md:text-base text-gray-300 mt-5 max-w-xl leading-relaxed">
              Everyday streetwear essentials with premium quality and reliable fit for Indian shoppers.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E63946] text-white text-sm font-bold tracking-[0.08em] hover:bg-[#c62833] transition-colors"
              >
                SHOP NOW
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/shop?filter=new"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/30 text-white text-sm font-bold tracking-[0.08em] hover:bg-white/10 transition-colors"
              >
                NEW ARRIVALS
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#111]">
              <Image
                src="/images/hero-1.png"
                alt="DripStore hero"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
