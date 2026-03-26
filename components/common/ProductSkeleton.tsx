'use client';

import { motion } from 'framer-motion';

export default function ProductSkeleton() {
  return (
    <motion.div
      className="bg-gray-200 rounded-lg overflow-hidden"
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-gray-300" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Product name skeleton */}
        <div className="h-4 bg-gray-300 rounded w-3/4" />

        {/* Price skeleton */}
        <div className="flex gap-2">
          <div className="h-4 bg-gray-300 rounded w-1/4" />
          <div className="h-4 bg-gray-300 rounded w-1/4" />
        </div>

        {/* Rating skeleton */}
        <div className="h-3 bg-gray-300 rounded w-1/3" />

        {/* Button skeleton */}
        <div className="h-10 bg-gray-300 rounded w-full" />
      </div>
    </motion.div>
  );
}
