"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category?: string;
  gender?: string;
  isNewArrival?: boolean;
  isSoldOut?: boolean;
  sizes?: { size: string; stock: number }[];
}

const CATEGORIES = ["T-Shirts", "Shirts", "Hoodies", "Shoes", "Jeans", "Joggers", "Jackets"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10"];
const GENDERS = ["Men", "Women", "Unisex"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    gender: [] as string[],
    category: [] as string[],
    size: [] as string[],
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.gender.length === 1) params.set("gender", filters.gender[0]);
    if (filters.category.length === 1) params.set("category", filters.category[0]);
    if (filters.size.length === 1) params.set("size", filters.size[0]);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort) params.set("sort", filters.sort);
    params.set("page", page.toString());
    params.set("limit", "12");

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || data.pagination?.total || 0);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleFilter = (key: "gender" | "category" | "size", val: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(val) ? prev[key].filter((v) => v !== val) : [...prev[key], val],
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ gender: [], category: [], size: [], minPrice: "", maxPrice: "", sort: "newest" });
    setPage(1);
  };

  const activeFilterCount =
    filters.gender.length +
    filters.category.length +
    filters.size.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  const FilterPill = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A0A0A] text-white text-xs font-bold rounded-full"
    >
      {label}
      <button onClick={onRemove}>
        <X size={11} />
      </button>
    </motion.span>
  );

  const FilterSection = ({
    title,
    items,
    type,
  }: {
    title: string;
    items: string[];
    type: "gender" | "category" | "size";
  }) => (
    <div className="py-4 border-b border-gray-100">
      <h4 className="text-xs font-black tracking-widest text-gray-400 mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = filters[type].includes(item);
          return (
            <button
              key={item}
              onClick={() => toggleFilter(type, item)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all ${
                active
                  ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                  : "border-gray-200 text-gray-600 hover:border-[#0A0A0A]"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="bg-[#0A0A0A] pt-8 pb-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#E63946] text-xs font-bold tracking-[0.3em] mb-2"
          >
            EXPLORE ALL
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tight"
          >
            SHOP ALL
          </motion.h1>
          <p className="text-gray-400 mt-2 text-sm">{total} products found</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#0A0A0A] font-bold text-sm rounded-full hover:bg-[#0A0A0A] hover:text-white transition-all"
          >
            <SlidersHorizontal size={15} />
            FILTERS
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-[#E63946] text-white text-[10px] rounded-full flex items-center justify-center font-black">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="relative ml-auto">
            <select
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              className="appearance-none pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-full text-sm font-bold focus:outline-none focus:border-[#0A0A0A] bg-white cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ArrowUpDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        </div>

        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-2 flex-wrap mb-5"
            >
              {filters.gender.map((g) => (
                <FilterPill key={g} label={g} onRemove={() => toggleFilter("gender", g)} />
              ))}
              {filters.category.map((c) => (
                <FilterPill key={c} label={c} onRemove={() => toggleFilter("category", c)} />
              ))}
              {filters.size.map((s) => (
                <FilterPill key={s} label={`Size ${s}`} onRemove={() => toggleFilter("size", s)} />
              ))}
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-gray-400 hover:text-[#E63946] transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 rounded-2xl" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-16" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-6xl">🕵️</div>
            <h3 className="text-2xl font-black">No products found</h3>
            <p className="text-gray-400">Try clearing your filters</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-[#E63946] text-white font-bold rounded-full text-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {total > 12 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-5 py-2.5 border-2 border-gray-200 rounded-full font-bold text-sm disabled:opacity-30 hover:border-[#0A0A0A] transition-colors"
            >
              ← PREV
            </button>
            <span className="px-4 py-2.5 text-sm font-bold">
              Page {page} of {Math.max(1, Math.ceil(total / 12))}
            </span>
            <button
              disabled={page >= Math.ceil(total / 12)}
              onClick={() => setPage((p) => p + 1)}
              className="px-5 py-2.5 bg-[#0A0A0A] text-white rounded-full font-bold text-sm disabled:opacity-30 hover:bg-[#E63946] transition-colors"
            >
              NEXT →
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[60] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b">
                <h3 className="font-black text-lg tracking-tight">FILTERS</h3>
                <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6">
                <FilterSection title="GENDER" items={GENDERS} type="gender" />
                <FilterSection title="CATEGORY" items={CATEGORIES} type="category" />
                <FilterSection title="SIZE" items={SIZES} type="size" />

                <div className="py-4 border-b border-gray-100">
                  <h4 className="text-xs font-black tracking-widest text-gray-400 mb-3">PRICE RANGE</h4>
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      placeholder="₹ Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]"
                    />
                    <span className="text-gray-300">—</span>
                    <input
                      type="number"
                      placeholder="₹ Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#0A0A0A]"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 border-t flex gap-3">
                <button
                  onClick={() => {
                    clearFilters();
                    setFilterOpen(false);
                  }}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-bold text-sm hover:border-[#0A0A0A] transition-colors"
                >
                  CLEAR
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 py-3 bg-[#0A0A0A] text-white rounded-xl font-bold text-sm hover:bg-[#E63946] transition-colors"
                >
                  APPLY ({total} items)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
