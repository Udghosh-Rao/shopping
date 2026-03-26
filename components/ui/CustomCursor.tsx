"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  if (typeof window === "undefined") return null;

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [label, setLabel] = useState("VIEW");
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const card = target.closest("[data-cursor]");
      if (card) {
        setHovered(true);
        setLabel(card.getAttribute("data-cursor") || "VIEW");
      }
    };

    const out = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-cursor]")) setHovered(false);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, []);

  if (!mounted || !enabled) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#E63946] rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{ x: pos.x - 4, y: pos.y - 4 }}
        transition={{ type: "spring", stiffness: 1000, damping: 50 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        animate={{
          x: pos.x - (hovered ? 40 : 16),
          y: pos.y - (hovered ? 40 : 16),
          width: hovered ? 80 : 32,
          height: hovered ? 80 : 32,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <div
          className="w-full h-full rounded-full border-2 border-[#0A0A0A] flex items-center justify-center transition-all"
          style={{ background: hovered ? "rgba(10,10,10,0.85)" : "transparent" }}
        >
          <AnimatePresence>
            {hovered && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-white text-[9px] font-black tracking-widest text-center leading-tight"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
