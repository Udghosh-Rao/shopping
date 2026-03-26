"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import toast from "react-hot-toast";

interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
}

export default function WishlistPage() {
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/wishlist");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: "remove" }),
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const handleAddToCart = (product: WishlistProduct) => {
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.discountPrice || product.price,
      image: product.images[0],
      size: "M",
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">My Wishlist</h1>
        <p className="text-gray-600 mb-8">
          {products.length} {products.length === 1 ? "item" : "items"} saved
        </p>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <Heart size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start adding items to save them for later</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-[#E63946] text-white font-bold rounded-lg hover:bg-red-700 transition"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.discountPrice && (
                      <div className="absolute top-3 right-3 bg-[#E63946] text-white px-2 py-1 rounded text-xs font-bold">
                        SALE
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4 space-y-3">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-[#E63946] transition">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2">
                    {product.discountPrice ? (
                      <>
                        <span className="text-lg font-black text-[#E63946]">
                          ₹{product.discountPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-black text-gray-900">
                        ₹{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 px-3 py-2 bg-[#E63946] text-white rounded-lg font-medium text-sm hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="px-3 py-2 border border-red-200 text-[#E63946] rounded-lg hover:bg-red-50 transition"
                    >
                      <Heart size={18} className="fill-[#E63946]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
