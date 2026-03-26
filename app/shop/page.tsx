'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Loader2,
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: { size: string; stock: number }[];
  stock: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  gender?: string;
  category?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const genders = ['Men', 'Women', 'Unisex'];
const categories = ['T-Shirts', 'Shoes', 'Hoodies', 'Jeans', 'Shirts', 'Jackets', 'Accessories'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '7', '8', '9', '10', '11', '28', '30', '32', '34', '36'];
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low → High', value: 'price-low' },
  { label: 'Price: High → Low', value: 'price-high' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters state from URL params
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedGender) params.set('gender', selectedGender);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSize) params.set('size', selectedSize);
    if (selectedSort) params.set('sort', selectedSort);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 10000) params.set('maxPrice', priceRange[1].toString());
    params.set('page', page.toString());
    params.set('limit', '12');

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || null);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedGender, selectedCategory, selectedSize, selectedSort, priceRange, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedGender) params.set('gender', selectedGender);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSize) params.set('size', selectedSize);
    if (selectedSort !== 'newest') params.set('sort', selectedSort);
    if (page > 1) params.set('page', page.toString());
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  }, [selectedGender, selectedCategory, selectedSize, selectedSort, page, router]);

  const clearFilters = () => {
    setSelectedGender('');
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedSort('newest');
    setPriceRange([0, 10000]);
    setPage(1);
  };

  const hasActiveFilters = selectedGender || selectedCategory || selectedSize || priceRange[0] > 0 || priceRange[1] < 10000;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Gender */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Gender</h3>
        <div className="flex flex-wrap gap-2">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => {
                setSelectedGender(selectedGender === g ? '' : g);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                selectedGender === g
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-[var(--border)] hover:border-foreground'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSelectedCategory(selectedCategory === c ? '' : c);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm rounded-xl border transition-all ${
                selectedCategory === c
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-[var(--border)] hover:border-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
          Price Range
        </h3>
        <div className="space-y-3">
          <input
            type="range"
            min={0}
            max={10000}
            step={100}
            value={priceRange[1]}
            onChange={(e) => {
              setPriceRange([priceRange[0], parseInt(e.target.value)]);
              setPage(1);
            }}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelectedSize(selectedSize === s ? '' : s);
                setPage(1);
              }}
              className={`w-10 h-10 text-sm rounded-xl border flex items-center justify-center transition-all ${
                selectedSize === s
                  ? 'bg-foreground text-background border-foreground'
                  : 'border-[var(--border)] hover:border-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 text-sm text-accent font-semibold border border-accent rounded-xl hover:bg-accent hover:text-white transition-all"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-28">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Shop All</h1>
        <p className="text-muted text-sm">
          {pagination ? `${pagination.total} products` : 'Loading...'}
        </p>
      </div>

      {/* Top Bar: Sort + Mobile Filter Toggle */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] rounded-xl text-sm font-medium hover:bg-[var(--input-bg)] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-accent" />
          )}
        </button>

        <div className="relative ml-auto">
          <select
            value={selectedSort}
            onChange={(e) => {
              setSelectedSort(e.target.value);
              setPage(1);
            }}
            className="appearance-none px-4 py-2.5 pr-10 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl text-sm focus:outline-none focus:border-accent cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <FilterContent />
          </div>
        </aside>

        {/* Mobile Filter Sheet */}
        <AnimatePresence>
          {filtersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[var(--overlay)] z-50 lg:hidden"
                onClick={() => setFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-80 bg-[var(--background)] z-[60] overflow-y-auto lg:hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="p-2 hover:bg-[var(--input-bg)] rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterContent />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="aspect-[3/4] skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-16 skeleton rounded" />
                    <div className="h-4 w-3/4 skeleton rounded" />
                    <div className="h-4 w-20 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-lg mb-4">No products found</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 text-sm font-semibold bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        page === p
                          ? 'bg-foreground text-background'
                          : 'border border-[var(--border)] hover:bg-[var(--input-bg)]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-28">
        <div className="mb-8">
          <div className="h-10 w-48 bg-[var(--skeleton)] animate-pulse rounded mb-2" />
          <div className="h-5 w-32 bg-[var(--skeleton)] animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="aspect-[3/4] skeleton" />
            </div>
          ))}
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
