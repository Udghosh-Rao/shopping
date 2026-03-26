'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck, Shield, Heart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Quick shipping to your doorstep',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: '100% Quality',
    description: 'Premium cotton material',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Comfortable & durable',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Sparkles,
    title: 'Trendy Designs',
    description: 'Fresh & stylish patterns',
    color: 'from-purple-500 to-indigo-500',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-accent/5 to-[var(--background)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent mb-3">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Quality You Can Trust
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto">
            We believe in providing the best quality t-shirts that your kids will love to wear every day.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative"
              >
                <div className="relative p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-accent/50 transition-all duration-300 h-full">
                  {/* Icon with Gradient */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-accent via-accent-hover to-accent overflow-hidden"
        >
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.2) 35px, rgba(255,255,255,.2) 70px)'
            }} />
          </div>

          <div className="relative z-10 text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4">
              Ready to Shop?
            </h3>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
              Browse our complete collection of premium t-shirts for boys and girls.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Shop All T-Shirts
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
