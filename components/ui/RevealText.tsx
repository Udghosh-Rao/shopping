"use client";

import { motion } from "framer-motion";

export default function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <div className={`flex flex-wrap gap-x-3 overflow-hidden ${className}`}>
      {words.map((word, i) => (
        <div key={`${word}-${i}`} className="overflow-hidden">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: delay + i * 0.08,
              duration: 0.55,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
