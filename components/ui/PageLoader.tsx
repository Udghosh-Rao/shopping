"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: "none" }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center gap-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-[#E63946] rounded-xl flex items-center justify-center">
              <Zap size={22} className="text-white" fill="white" />
            </div>
            <span className="text-3xl font-black text-white tracking-tight">
              DRIP<span className="text-[#E63946]">STORE</span>
            </span>
          </motion.div>

          <motion.div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mt-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="h-full bg-[#E63946] rounded-full"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.3 }}
            className="text-white text-xs tracking-[0.4em] font-bold mt-2"
          >
            LOADING YOUR DRIP...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
