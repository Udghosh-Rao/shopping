"use client";

import { motion } from "framer-motion";

const items = [
  "FREE SHIPPING ABOVE ₹599",
  "NEW DROP EVERY FRIDAY ✦",
  "100% AUTHENTIC PRODUCTS",
  "EASY 15-DAY RETURNS ✦",
  "SHOP MEN & WOMEN",
  "PAY VIA UPI, CARDS & MORE ✦",
  "MADE IN INDIA 🇮🇳",
];

export default function MarqueeBanner() {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="bg-[#E63946] text-white py-3 overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap will-change-transform"
      >
        {repeated.map((item, i) => (
          <span key={i} className="text-[11px] font-bold tracking-[0.25em] mx-10 flex-shrink-0">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
