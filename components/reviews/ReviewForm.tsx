"use client";

import { useState } from "react";
import { Star, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  if (status === "loading") {
    return <div className="py-8 px-4 bg-gray-50 rounded-lg animate-pulse h-96" />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="py-8 px-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <p className="text-gray-700 mb-4">Please log in to submit a review</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-[#E63946] text-white rounded-lg hover:bg-red-700 transition"
        >
          Login to Review
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (text.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          text: text.trim(),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit review");
      }

      const data = await res.json();
      setVerified(data.message?.includes("verified"));
      toast.success(data.message || "Review submitted successfully!");
      setRating(0);
      setText("");
      onReviewSubmitted?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit review";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl">
      <h3 className="text-xl font-bold mb-6">Share Your Review</h3>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-3">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={`${
                  star <= (hoveredRating || rating)
                    ? "fill-[#E63946] text-[#E63946]"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Your Review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="Share your experience with this product..."
          maxLength={500}
          rows={5}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E63946] resize-none"
        />
        <p className="text-xs text-gray-500 mt-2">
          {text.length}/500 characters
        </p>
      </div>

      {verified && (
        <div className="mb-6 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle size={18} className="text-green-600" />
          <span className="text-sm text-green-700 font-medium">Verified Purchase</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#E63946] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </button>
    </form>
  );
}
