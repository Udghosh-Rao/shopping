"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import RevealText from "@/components/ui/RevealText";

const reviews = [
  {
    name: "Arjun S.",
    location: "Mumbai",
    rating: 5,
    text: "Quality is absolutely insane for the price. Got the oversized tee and the fit is chef's kiss. Delivered in 2 days flat!",
    product: "Oversized Drop Tee",
    avatar: "A",
    color: "#E63946",
  },
  {
    name: "Priya K.",
    location: "Bangalore",
    rating: 5,
    text: "Finally a brand that actually gets Indian streetwear. The sneakers are fire and packaging was super premium.",
    product: "Kanso ZE Sneakers",
    avatar: "P",
    color: "#0A0A0A",
  },
  {
    name: "Rahul M.",
    location: "Delhi",
    rating: 5,
    text: "Ordered 3 tees at once. All different designs, all perfect quality. Will definitely be back for more!",
    product: "Marvel Series Tee",
    avatar: "R",
    color: "#E63946",
  },
  {
    name: "Sneha T.",
    location: "Pune",
    rating: 4,
    text: "Loved the packaging and quality so much. Tip: size runs a little large, go one size down for fitted look.",
    product: "Korean Joggers",
    avatar: "S",
    color: "#0A0A0A",
  },
];

export default function ReviewsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-[#E63946] text-xs font-bold tracking-[0.3em] mb-3">REAL PEOPLE, REAL REVIEWS</p>
          <div className="flex justify-center">
            <RevealText text="THEY LOVE IT" className="text-4xl md:text-5xl font-black tracking-tight mb-5" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-[#E63946] text-[#E63946]" />
              ))}
            </div>
            <span className="font-black text-lg">4.9</span>
            <span className="text-gray-400 text-sm">from 2,300+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#F8F5F0] rounded-2xl p-6 flex flex-col justify-between gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div>
                <Quote size={24} className="text-[#E63946] mb-3 opacity-60" />
                <p className="text-sm text-gray-600 leading-relaxed">"{review.text}"</p>
              </div>
              <div>
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} size={12} className="fill-[#E63946] text-[#E63946]" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0" style={{ background: review.color }}>
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#0A0A0A]">{review.name}</p>
                    <p className="text-xs text-gray-400">
                      {review.location} · {review.product}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
