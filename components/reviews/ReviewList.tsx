"use client";

import { useEffect, useState } from "react";
import { Star, ThumbsUp, Loader2 } from "lucide-react";
import { CheckCircle } from "lucide-react";

interface Review {
  _id: string;
  rating: number;
  text: string;
  verified: boolean;
  helpful: number;
  userId: { name: string };
  createdAt: string;
}

interface ReviewListProps {
  productId: string;
}

export default function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating || 0);
        setTotalCount(data.totalCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpful = (reviewId: string) => {
    setHelpfulIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(reviewId)) {
        updated.delete(reviewId);
      } else {
        updated.add(reviewId);
      }
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex flex-col">
            <div className="text-4xl font-black text-[#0A0A0A]">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${
                    i < Math.round(avgRating)
                      ? "fill-[#E63946] text-[#E63946]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              Based on <span className="font-bold text-gray-900">{totalCount}</span> reviews
            </p>
          </div>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">{review.userId.name}</h4>
                    {review.verified && (
                      <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle size={14} className="text-green-600" />
                        <span className="text-xs font-medium text-green-700">Verified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < review.rating
                            ? "fill-[#E63946] text-[#E63946]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="text-gray-700 text-sm mb-4 leading-relaxed">{review.text}</p>

              <button
                onClick={() => handleHelpful(review._id)}
                className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition ${
                  helpfulIds.has(review._id)
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ThumbsUp size={16} />
                Helpful ({review.helpful})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
