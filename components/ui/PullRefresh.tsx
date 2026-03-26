"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

export default function PullRefresh() {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 80], [0, 1]);
  const scale = useTransform(y, [0, 80], [0.5, 1]);
  const rotate = useTransform(y, [0, 80], [0, 360]);
  const [refreshing, setRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    const touchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) setStartY(e.touches[0].clientY);
    };
    const touchMove = (e: TouchEvent) => {
      if (startY === 0) return;
      const delta = e.touches[0].clientY - startY;
      if (delta > 0 && delta < 120) y.set(delta);
    };
    const touchEnd = () => {
      if (y.get() > 70) {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
          y.set(0);
          setStartY(0);
          window.location.reload();
        }, 1500);
      } else {
        y.set(0);
        setStartY(0);
      }
    };
    window.addEventListener("touchstart", touchStart);
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", touchEnd);
    return () => {
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("touchend", touchEnd);
    };
  }, [startY, y]);

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center shadow-lg md:hidden pointer-events-none"
    >
      <motion.div style={{ rotate }}>
        <RefreshCw size={18} className={refreshing ? "text-[#E63946]" : "text-white"} />
      </motion.div>
    </motion.div>
  );
}
