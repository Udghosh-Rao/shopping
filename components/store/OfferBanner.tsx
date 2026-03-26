'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function OfferBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl grain"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]" />

        {/* Animated orbs */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-purple-500/15 blur-3xl" style={{ animationDelay: '3s' }} />
        <div className="absolute right-1/3 bottom-0 w-40 h-40 rounded-full bg-blue-500/10 blur-2xl animate-float" style={{ animationDelay: '1.5s' }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/70 text-xs font-semibold tracking-widest uppercase mb-5 border border-white/10">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              LIMITED TIME OFFER
            </div>
            <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-[0.95] mb-3 tracking-tight">
              FLAT <span className="text-accent">30% OFF</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base max-w-md">
              On your very first order. Use code <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 inline-block ml-1">WELCOME30</span>
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] font-bold rounded-2xl hover:bg-accent hover:text-white transition-all duration-300 text-sm sm:text-base whitespace-nowrap animate-pulse-glow"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
