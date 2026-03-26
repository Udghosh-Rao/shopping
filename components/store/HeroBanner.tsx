"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    id: 1,
    tag: "NEW DROP 🔥",
    title: "SUMMER\nCOLLECTION",
    subtitle: "Fresh T-Shirts & Sneakers — Starting ₹799",
    cta: "SHOP MEN",
    ctaLink: "/shop?gender=Men",
    bg: "#0A0A0A",
    textColor: "white",
    accentColor: "#E63946",
  },
  {
    id: 2,
    tag: "WOMEN'S EDIT ✨",
    title: "STYLE\nTHAT SPEAKS",
    subtitle: "Curated for her — Dresses, Tops & More",
    cta: "SHOP WOMEN",
    ctaLink: "/shop?gender=Women",
    bg: "#F8F5F0",
    textColor: "#0A0A0A",
    accentColor: "#E63946",
  },
  {
    id: 3,
    tag: "LIMITED EDITION ⚡",
    title: "GRAB IT\nBEFORE IT'S GONE",
    subtitle: "Limited drops — Only a few left",
    cta: "SHOP NOW",
    ctaLink: "/shop",
    bg: "#E63946",
    textColor: "white",
    accentColor: "#0A0A0A",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div
      className="relative h-[92vh] mt-[104px] overflow-hidden flex items-center"
      style={{ background: slide.bg, transition: "background 0.8s ease" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 md:px-16 w-full"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold tracking-widest mb-4"
            style={{ color: slide.accentColor }}
          >
            {slide.tag}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-9xl font-black leading-none tracking-tighter whitespace-pre-line mb-6"
            style={{ color: slide.textColor }}
          >
            {slide.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl mb-8 opacity-80"
            style={{ color: slide.textColor }}
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href={slide.ctaLink}
              className="inline-block px-10 py-4 font-bold text-sm tracking-widest border-2 transition-all duration-300 hover:scale-105"
              style={{
                borderColor: slide.textColor,
                color: slide.bg,
                background: slide.textColor,
              }}
            >
              {slide.cta} →
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === current ? "32px" : "8px",
              background: i === current ? slide.textColor : "rgba(255,255,255,0.4)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
