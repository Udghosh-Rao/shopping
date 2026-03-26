"use client";

import { motion } from "framer-motion";

const items = [
  "FREE SHIP ABOVE ₹599",
  "✦",
  "NEW DROP EVERY FRIDAY",
  "✦",
  "EASY 15-DAY RETURNS",
  "✦",
  "USE CODE DRIP50",
  "✦",
  "MADE IN INDIA 🇮🇳",
  "✦",
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
          <span key={i} className="text-[11px] font-bold tracking-[0.2em] mx-6 flex-shrink-0">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
