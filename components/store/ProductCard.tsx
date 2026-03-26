"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category?: string;
  gender?: string;
  isNewArrival?: boolean;
  isSoldOut?: boolean;
  stock?: number;
  sizes?: { size: string; stock: number }[];
}

export default function ProductCard({ product }: { product: Product; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const soldOut = product.isSoldOut || (typeof product.stock === "number" ? product.stock === 0 : false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (soldOut) {
      toast.error("This product is sold out");
      return;
    }

    const size = product.sizes?.find((s) => s.stock > 0)?.size || "M";

    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "/next.svg",
      size,
      quantity: 1,
      price: product.price,
      discountPrice: product.discountPrice,
    });

    toast.success("Added to cart!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-[#F8F5F0] overflow-hidden rounded-lg">
          <motion.div
            animate={{ opacity: hovered && product.images[1] ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={product.images[0] || "/next.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </motion.div>

          {product.images[1] && (
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={product.images[1]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </motion.div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isNewArrival && (
              <span className="bg-[#0A0A0A] text-white text-xs px-2 py-1 font-bold tracking-wider">
                NEW
              </span>
            )}
            {discount && (
              <span className="bg-[#E63946] text-white text-xs px-2 py-1 font-bold">
                {discount}% OFF
              </span>
            )}
            {soldOut && (
              <span className="bg-gray-400 text-white text-xs px-2 py-1 font-bold">
                SOLD OUT
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted(!wishlisted);
            }}
            className="absolute top-3 right-3"
            aria-label="Toggle wishlist"
          >
            <motion.div whileTap={{ scale: 0.8 }}>
              <Heart
                size={20}
                className={wishlisted ? "fill-[#E63946] text-[#E63946]" : "text-gray-400"}
              />
            </motion.div>
          </button>

          <motion.button
            type="button"
            onClick={handleQuickAdd}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] text-white py-3 flex items-center justify-center gap-2 text-sm font-bold tracking-wider"
          >
            <ShoppingBag size={16} />
            QUICK ADD
          </motion.button>
        </div>

        <div className="mt-3">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            {product.category || product.gender || "Fashion"}
          </p>
          <h3 className="font-semibold text-sm text-[#0A0A0A] leading-tight mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="font-bold text-[#E63946]">₹{product.discountPrice}</span>
                <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
              </>
            ) : (
              <span className="font-bold text-[#0A0A0A]">₹{product.price}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
