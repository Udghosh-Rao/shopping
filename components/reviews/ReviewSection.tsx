"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <section className="py-12 md:py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-black mb-2">Customer Reviews</h2>
          <p className="text-gray-600">What customers think about this product</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div>
            <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
          </div>
          <div className="lg:col-span-2">
            <ReviewList key={refreshTrigger} productId={productId} />
          </div>
        </div>
      </div>
    </section>
  );
}
