"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const slides = [
  {
    id: 1,
    tag: "NEW DROP 🔥",
    eyebrow: "SUMMER 2026",
    title: ["WEAR", "YOUR", "VIBE"],
    subtitle: "T-Shirts, Hoodies & Sneakers — Built for the Bold",
    cta: "SHOP MEN",
    cta2: "SHOP WOMEN",
    link: "/shop?gender=Men",
    link2: "/shop?gender=Women",
    bg: "#0A0A0A",
    textColor: "#FFFFFF",
    accent: "#E63946",
    stat1: "500+ Styles",
    stat2: "Free Delivery",
  },
  {
    id: 2,
    tag: "WOMEN'S EDIT ✨",
    eyebrow: "JUST ARRIVED",
    title: ["STYLE", "THAT", "SPEAKS"],
    subtitle: "Curated for her — Dresses, Co-ords & More",
    cta: "EXPLORE NOW",
    cta2: "VIEW LOOKBOOK",
    link: "/shop?gender=Women",
    link2: "/shop",
    bg: "#F8F5F0",
    textColor: "#0A0A0A",
    accent: "#E63946",
    stat1: "400+ Styles",
    stat2: "Easy Returns",
  },
  {
    id: 3,
    tag: "LIMITED DROP ⚡",
    eyebrow: "ONLY 50 LEFT",
    title: ["GRAB", "IT", "NOW"],
    subtitle: "Exclusive drops — Once gone, they're gone forever",
    cta: "SHOP LIMITED",
    cta2: "SEE ALL DROPS",
    link: "/shop?filter=new",
    link2: "/shop",
    bg: "#E63946",
    textColor: "#FFFFFF",
    accent: "#0A0A0A",
    stat1: "Limited Pieces",
    stat2: "Ships Today",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 5500);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = slides[current];

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: slide.bg }}
    >
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-[30vw] font-black leading-none select-none pointer-events-none"
        style={{ color: slide.textColor, opacity: 0.03 }}
      >
        0{current + 1}
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pt-24 md:pt-28 pb-12 md:pb-16">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 80 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -80 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-6"
              >
                <span
                  className="text-xs font-bold tracking-[0.3em] px-3 py-1.5 rounded-full border"
                  style={{ color: slide.accent, borderColor: slide.accent }}
                >
                  {slide.tag}
                </span>
                <span className="text-xs font-semibold tracking-[0.2em] opacity-50" style={{ color: slide.textColor }}>
                  {slide.eyebrow}
                </span>
              </motion.div>

              <div className="mb-6">
                {slide.title.map((word, i) => (
                  <motion.div
                    key={word}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <h1
                      className="text-[14vw] sm:text-[11vw] md:text-[9vw] lg:text-[7.5vw] font-black leading-[0.9] tracking-[-0.03em]"
                      style={{ color: slide.textColor }}
                    >
                      {word}
                    </h1>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="text-base md:text-lg mb-8 leading-relaxed max-w-md opacity-70"
                style={{ color: slide.textColor }}
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-wrap gap-3 mb-12"
              >
                <MagneticButton className="px-0 py-0">
                  <Link
                    href={slide.link}
                    className="group flex items-center gap-2 px-8 py-4 font-bold text-sm tracking-[0.15em] transition-all duration-300 hover:gap-4"
                    style={{ background: slide.accent, color: "#FFFFFF" }}
                  >
                    {slide.cta}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </MagneticButton>
                <MagneticButton className="px-0 py-0">
                  <Link
                    href={slide.link2}
                    className="px-8 py-4 font-bold text-sm tracking-[0.15em] border-2 transition-all duration-300 hover:opacity-70"
                    style={{ borderColor: slide.textColor, color: slide.textColor }}
                  >
                    {slide.cta2}
                  </Link>
                </MagneticButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="flex gap-8"
              >
                {[slide.stat1, slide.stat2, "₹599 Free Ship"].map((stat, i) => (
                  <div key={i}>
                    <div className="w-6 h-0.5 mb-2" style={{ background: slide.accent }} />
                    <p className="text-xs font-semibold tracking-widest opacity-60" style={{ color: slide.textColor }}>
                      {stat}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900">
                <Image
                  src={`/images/hero-${current + 1}.png`}
                  alt={`Hero slide ${current + 1}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 448px"
                  priority
                />

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-6 right-6 px-4 py-2 rounded-full text-xs font-bold z-10"
                  style={{ background: slide.accent, color: "#fff" }}
                >
                  NEW DROP
                </motion.div>

                <div
                  className="absolute bottom-6 left-6 px-4 py-3 rounded-xl z-10"
                  style={{ background: slide.bg, color: slide.textColor }}
                >
                  <p className="text-xs opacity-50 font-medium">Starting from</p>
                  <p className="text-xl font-black">₹799</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className="relative h-0.5 bg-white/20 transition-all duration-300"
                style={{ width: i === current ? "48px" : "24px" }}
              >
                {i === current && (
                  <motion.div className="absolute inset-0" style={{ background: slide.textColor }} layoutId="progressBar" />
                )}
                {i !== current && <div className="absolute inset-0" style={{ background: slide.textColor, opacity: 0.3 }} />}
              </button>
            ))}
            <span className="text-xs font-bold opacity-40" style={{ color: slide.textColor }}>
              0{current + 1} / 0{slides.length}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-110"
              style={{ borderColor: `${slide.textColor}40`, color: slide.textColor }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: slide.accent, color: "#fff" }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
