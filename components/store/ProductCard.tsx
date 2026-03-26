"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
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
  sizes?: { size: string; stock: number }[];
}

export default function ProductCard({ product }: { product: Product; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizes, setShowSizes] = useState(false);
  const { addItem } = useCart();

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null;

  const availableSizes = product.sizes?.filter((s) => s.stock > 0) || [];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.isSoldOut) return;
    if (availableSizes.length <= 1) {
      addItem({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        image: product.images[0],
        size: availableSizes[0]?.size || "M",
        quantity: 1,
      });
      toast.success("Added to bag! ��️", { duration: 2000 });
    } else {
      setShowSizes((prev) => !prev);
    }
  };

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.images[0],
      size,
      quantity: 1,
    });
    toast.success(`Added (${size}) to bag! 🛍️`);
    setShowSizes(false);
  };

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSizes(false);
      }}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] bg-[#F8F5F0] overflow-hidden rounded-2xl">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-500 ${
                hovered && product.images[1] ? "opacity-0 scale-105" : "opacity-100 scale-100"
              }`}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}

          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              className={`object-cover absolute inset-0 transition-all duration-500 ${
                hovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}

          {!product.images[0] && (
            <div className="absolute inset-0 flex items-center justify-center text-4xl">👕</div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNewArrival && (
              <span className="bg-[#0A0A0A] text-white text-[10px] px-2.5 py-1 font-black tracking-[0.2em] rounded-full">
                NEW
              </span>
            )}
            {discount && !product.isSoldOut && (
              <span className="bg-[#E63946] text-white text-[10px] px-2.5 py-1 font-black rounded-full">-{discount}%</span>
            )}
            {product.isSoldOut && (
              <span className="bg-gray-500 text-white text-[10px] px-2.5 py-1 font-black tracking-[0.15em] rounded-full">
                SOLD OUT
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted(!wishlisted);
              toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
            }}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
          >
            <Heart
              size={14}
              className={`transition-colors ${wishlisted ? "fill-[#E63946] text-[#E63946]" : "text-gray-400"}`}
            />
          </button>

          <AnimatePresence>
            {hovered && !showSizes && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-end justify-end p-3 gap-2 z-10"
              >
                <Link
                  href={`/product/${product.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[#0A0A0A] hover:text-white transition-colors"
                >
                  <Eye size={15} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSizes && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-14 left-3 right-3 bg-white rounded-xl shadow-xl p-3 z-20"
                onClick={(e) => e.preventDefault()}
              >
                <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-2">SELECT SIZE</p>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map(({ size }) => (
                    <button
                      key={size}
                      onClick={(e) => handleSizeSelect(e, size)}
                      className={`px-3 py-1.5 text-xs font-bold border-2 rounded-lg transition-all ${
                        selectedSize === size
                          ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                          : "border-gray-200 hover:border-[#0A0A0A]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleQuickAdd}
            initial={{ y: 50, opacity: 0 }}
            animate={hovered ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 py-3 flex items-center justify-center gap-2 text-xs font-black tracking-[0.15em] z-10 rounded-b-2xl transition-colors"
            style={{
              background: product.isSoldOut ? "#9CA3AF" : "#0A0A0A",
              color: "#FFFFFF",
            }}
          >
            <ShoppingBag size={13} />
            {product.isSoldOut ? "SOLD OUT" : availableSizes.length === 1 ? "QUICK ADD" : "SELECT SIZE"}
          </motion.button>
        </div>

        <div className="mt-3 px-0.5">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 mb-1 uppercase">
            {product.category || "Fashion"} · {product.gender || "Unisex"}
          </p>
          <h3 className="font-semibold text-sm text-[#0A0A0A] leading-snug mb-1.5 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="font-black text-[#E63946] text-base">₹{product.discountPrice}</span>
                <span className="text-gray-400 line-through text-xs">₹{product.price}</span>
              </>
            ) : (
              <span className="font-black text-[#0A0A0A] text-base">₹{product.price}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
