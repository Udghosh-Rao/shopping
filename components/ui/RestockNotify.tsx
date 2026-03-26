"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function RestockNotify({ productName }: { productName: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    toast.success(`We'll notify you when ${productName} is back! 🔔`);
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
        <Check size={16} /> You&apos;re on the list!
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F0] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={16} className="text-[#E63946]" />
        <p className="font-black text-sm">NOTIFY WHEN BACK IN STOCK</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0A0A0A]"
          required
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#0A0A0A] text-white text-xs font-black rounded-xl hover:bg-[#E63946] transition-colors"
        >
          NOTIFY ME
        </button>
      </form>
    </div>
  );
}
