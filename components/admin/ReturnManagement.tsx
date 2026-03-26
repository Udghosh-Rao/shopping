"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Return {
  _id: string;
  orderId: string;
  userId: { name: string; email: string };
  reason: string;
  status: string;
  refundAmount: number;
  createdAt: string;
}

export default function ReturnManagement() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/returns?status=pending");
      if (res.ok) {
        const data = await res.json();
        setReturns(data.returns || []);
      }
    } catch (error) {
      console.error("Failed to fetch returns:", error);
      toast.error("Failed to load returns");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (returnId: string, refundAmount: number) => {
    const notes = adminNotes[returnId] || "";
    setApproving(returnId);

    try {
      const res = await fetch(`/api/returns/${returnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "approved",
          adminNotes: notes,
          refundAmount,
        }),
      });

      if (!res.ok) throw new Error("Failed to approve return");

      setReturns((prev) => prev.filter((r) => r._id !== returnId));
      toast.success("Return approved successfully");
    } catch (error) {
      toast.error("Failed to approve return");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (returnId: string) => {
    const notes = adminNotes[returnId] || "";
    setRejecting(returnId);

    try {
      const res = await fetch(`/api/returns/${returnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected",
          adminNotes: notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to reject return");

      setReturns((prev) => prev.filter((r) => r._id !== returnId));
      toast.success("Return rejected");
    } catch (error) {
      toast.error("Failed to reject return");
    } finally {
      setRejecting(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Return Management</h2>
        <p className="text-gray-600 mt-1">
          {returns.length} pending return{returns.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-4 p-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : returns.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No pending returns at the moment</p>
          </div>
        ) : (
          returns.map((returnItem) => (
            <div
              key={returnItem._id}
              className="border border-gray-200 rounded-lg p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono text-sm font-bold">{returnItem.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">{returnItem.userId.name}</p>
                  <p className="text-sm text-gray-500">{returnItem.userId.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Refund Amount</p>
                  <p className="text-lg font-bold text-[#E63946]">
                    ₹{returnItem.refundAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Reason</p>
                <p className="text-gray-900">{returnItem.reason}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Admin Notes</label>
                <textarea
                  value={adminNotes[returnItem._id] || ""}
                  onChange={(e) =>
                    setAdminNotes((prev) => ({
                      ...prev,
                      [returnItem._id]: e.target.value,
                    }))
                  }
                  placeholder="Add notes for customer..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() =>
                    handleReject(returnItem._id)
                  }
                  disabled={rejecting === returnItem._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50"
                >
                  {rejecting === returnItem._id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle size={18} />
                      Reject
                    </>
                  )}
                </button>
                <button
                  onClick={() =>
                    handleApprove(returnItem._id, returnItem.refundAmount)
                  }
                  disabled={approving === returnItem._id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {approving === returnItem._id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Approve & Refund
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
