"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, Clock } from "lucide-react";
import SaleCountdown from "./SaleCountdown";

interface Sale {
  _id: string;
  name: string;
  discountPercent: number;
  endTime: string;
  productIds: string[];
}

export default function FlashSaleHero() {
  const [activeSale, setActiveSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActiveSale();
  }, []);

  const fetchActiveSale = async () => {
    try {
      const res = await fetch("/api/sales?active=true");
      if (res.ok) {
        const data = await res.json();
        if (data.sales && data.sales.length > 0) {
          setActiveSale(data.sales[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch active sales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !activeSale) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-[#E63946] to-red-700 text-white py-8 md:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Flame size={24} />
              <span className="text-sm font-bold tracking-[0.08em]">FLASH SALE</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">{activeSale.name}</h2>
            <p className="text-lg md:text-xl font-bold mb-4">
              Get up to {activeSale.discountPercent}% OFF
            </p>
            <Link
              href={`/sale/${activeSale._id}`}
              className="inline-block px-6 py-3 bg-white text-[#E63946] font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Shop Now
            </Link>
          </div>

          <div className="flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Clock size={20} />
                <span className="text-sm font-bold">ENDS IN</span>
              </div>
              <SaleCountdown endTime={activeSale.endTime} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
