"use client";

import { useEffect, useState } from "react";
import { Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  productId: string;
  userId: { name: string };
  rating: number;
  text: string;
  verified: boolean;
  createdAt: string;
}

type FilterType = "all" | "pending" | "verified" | "unverified";

export default function ReviewModeration() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [filter, page]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (filter !== "all") query.append("status", filter);
      query.append("page", page.toString());

      const res = await fetch(`/api/admin/reviews?${query}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setDeleting(reviewId);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete review");

      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setDeleting(null);
    }
  };

  const handleVerify = async (reviewId: string) => {
    setVerifying(reviewId);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: true }),
      });

      if (!res.ok) throw new Error("Failed to verify review");

      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId ? { ...r, verified: true } : r
        )
      );
      toast.success("Review marked as verified");
    } catch (error) {
      toast.error("Failed to verify review");
    } finally {
      setVerifying(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-4">Review Moderation</h2>

        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "verified", "unverified"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                filter === f
                  ? "bg-[#E63946] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Review</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <Loader2 className="animate-spin mx-auto" size={24} />
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    <span className="font-medium">{review.userId.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">
                    {review.text}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-bold">{review.rating}/5</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {review.verified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <CheckCircle size={14} />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        <AlertCircle size={14} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      {!review.verified && (
                        <button
                          onClick={() => handleVerify(review._id)}
                          disabled={verifying === review._id}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition disabled:opacity-50"
                        >
                          {verifying === review._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            "Verify"
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={deleting === review._id}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition disabled:opacity-50"
                      >
                        {deleting === review._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t flex justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
