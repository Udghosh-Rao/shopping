"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, createContext, useContext } from "react";

interface FlyItem {
  id: number;
  startX: number;
  startY: number;
}

const FlyContext = createContext<{
  flyToCart: (x: number, y: number) => void;
}>({ flyToCart: () => {} });

export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FlyItem[]>([]);

  const flyToCart = useCallback((x: number, y: number) => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, startX: x, startY: y }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 1000);
  }, []);

  const cartX = typeof window !== "undefined" ? window.innerWidth - 60 : 0;
  const cartY = 50;

  return (
    <FlyContext.Provider value={{ flyToCart }}>
      {children}
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ x: item.startX, y: item.startY, scale: 1, opacity: 1 }}
            animate={{ x: cartX, y: cartY, scale: 0.2, opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed z-[9999] w-8 h-8 bg-[#E63946] rounded-full pointer-events-none flex items-center justify-center"
            style={{ top: 0, left: 0, translateX: "-50%", translateY: "-50%" }}
          >
            <span className="text-white text-xs">🛍️</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </FlyContext.Provider>
  );
}

export const useFlyToCart = () => useContext(FlyContext);
