"use client";

import { useState } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ReturnRequestModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  orderDate: string;
  onSuccess?: () => void;
}

const RETURN_REASONS = [
  "Defective or damaged",
  "Wrong size",
  "Not as described",
  "Changed mind",
  "Other",
];

export default function ReturnRequestModal({
  orderId,
  isOpen,
  onClose,
  orderDate,
  onSuccess,
}: ReturnRequestModalProps) {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const orderDateObj = new Date(orderDate);
  const deadlineDate = new Date(orderDateObj.getTime() + 15 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  const isUrgent = daysLeft <= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      toast.error("Please select a return reason");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          reason,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit return request");
      }

      toast.success("Return request submitted successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit return request";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Request Return</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {isUrgent && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-red-900">Hurry!</p>
                <p className="text-red-800">
                  You have only {daysLeft} days left to request a return
                </p>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600 mb-2">
              Return deadline: <span className="font-bold">{deadlineDate.toLocaleDateString()}</span>
            </p>
            <p className="text-xs text-gray-500">Returns must be requested within 15 days of purchase</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-3">Return Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
              >
                <option value="">Select a reason...</option>
                {RETURN_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-[#E63946] text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Request Return"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
