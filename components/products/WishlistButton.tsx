"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: string;
  isWishlisted?: boolean;
}

export default function WishlistButton({ productId, isWishlisted = false }: WishlistButtonProps) {
  const { status } = useSession();
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, action: wishlisted ? "remove" : "add" }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update wishlist");
      }

      setWishlisted(!wishlisted);
      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update wishlist";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="p-2 rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={24}
        className={`transition-all ${
          wishlisted
            ? "fill-[#E63946] text-[#E63946]"
            : "text-gray-600 hover:text-[#E63946]"
        }`}
      />
    </button>
  );
}
