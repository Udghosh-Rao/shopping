export type CatalogSize = { size: string; stock: number };

export type CatalogProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: "T-Shirts" | "Shoes" | "Hoodies" | "Jeans" | "Shirts" | "Jackets" | "Accessories";
  gender: "Men" | "Women" | "Unisex";
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: CatalogSize[];
  stock: number;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  careInstructions?: string;
  createdAt: string;
  updatedAt: string;
};

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

export const SAMPLE_PRODUCTS: CatalogProduct[] = [
  {
    _id: "sample-1",
    name: "Style That Speaks Tee",
    slug: "style-that-speaks-tee",
    description: "Bold statement tee with premium drape and everyday comfort.",
    category: "T-Shirts",
    gender: "Women",
    price: 1299,
    discountPrice: 899,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: [
      { size: "S", stock: 0 },
      { size: "M", stock: 12 },
      { size: "L", stock: 6 },
    ],
    stock: 18,
    tags: ["style", "tee", "streetwear"],
    isFeatured: true,
    isNewArrival: true,
    careInstructions: "Machine wash cold. Tumble dry low.",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    _id: "sample-2",
    name: "Classic Black Oversized T-Shirt",
    slug: "classic-black-oversized-tshirt",
    description: "Heavyweight oversized tee designed for comfort and fit.",
    category: "T-Shirts",
    gender: "Men",
    price: 1299,
    discountPrice: 899,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    ],
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 22 },
      { size: "L", stock: 14 },
      { size: "XL", stock: 8 },
    ],
    stock: 54,
    tags: ["oversized", "black", "tee"],
    isFeatured: true,
    isNewArrival: false,
    careInstructions: "Wash cold. Do not bleach.",
    createdAt: daysAgo(18),
    updatedAt: daysAgo(15),
  },
  {
    _id: "sample-3",
    name: "Midnight Blue Hoodie",
    slug: "midnight-blue-hoodie",
    description: "Soft fleece hoodie with adjustable hood and a clean silhouette.",
    category: "Hoodies",
    gender: "Men",
    price: 2499,
    discountPrice: 1999,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800",
    ],
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 18 },
      { size: "L", stock: 22 },
      { size: "XL", stock: 10 },
      { size: "XXL", stock: 4 },
    ],
    stock: 60,
    tags: ["hoodie", "fleece", "blue"],
    isFeatured: true,
    isNewArrival: true,
    careInstructions: "Machine wash cold. Do not iron on print.",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(3),
  },
  {
    _id: "sample-4",
    name: "Vintage Wash Denim Jacket",
    slug: "vintage-wash-denim-jacket",
    description: "Vintage wash denim jacket with chest pockets and a premium finish.",
    category: "Jackets",
    gender: "Unisex",
    price: 3499,
    discountPrice: 2799,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800",
    ],
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 10 },
      { size: "L", stock: 14 },
      { size: "XL", stock: 3 },
    ],
    stock: 32,
    tags: ["denim", "jacket", "vintage"],
    isFeatured: false,
    isNewArrival: true,
    careInstructions: "Hang dry after washing.",
    createdAt: daysAgo(8),
    updatedAt: daysAgo(6),
  },
  {
    _id: "sample-5",
    name: "White Minimalist Sneakers",
    slug: "white-minimalist-sneakers",
    description: "Minimalist white leather sneakers with cushioned comfort.",
    category: "Shoes",
    gender: "Unisex",
    price: 4999,
    discountPrice: 3999,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
    ],
    sizes: [
      { size: "7", stock: 0 },
      { size: "8", stock: 8 },
      { size: "9", stock: 12 },
      { size: "10", stock: 6 },
      { size: "11", stock: 2 },
    ],
    stock: 28,
    tags: ["sneakers", "white", "minimalist"],
    isFeatured: true,
    isNewArrival: true,
    careInstructions: "Wipe clean with damp cloth.",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
  {
    _id: "sample-6",
    name: "Coral Summer Dress",
    slug: "coral-summer-dress",
    description: "Flowy coral summer dress with a premium feel and silhouette.",
    category: "Shirts",
    gender: "Women",
    price: 1999,
    discountPrice: 1599,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    ],
    sizes: [
      { size: "XS", stock: 3 },
      { size: "S", stock: 10 },
      { size: "M", stock: 16 },
      { size: "L", stock: 9 },
    ],
    stock: 38,
    tags: ["dress", "summer", "coral"],
    isFeatured: false,
    isNewArrival: true,
    careInstructions: "Hand wash cold. Lay flat to dry.",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

function catalogSoldOut(p: CatalogProduct) {
  return p.sizes.reduce((acc, s) => acc + s.stock, 0) <= 0;
}

type ProductsQuery = {
  gender?: string | null;
  category?: string | null;
  featured?: boolean;
  newArrivals?: boolean;
  size?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  sort?: string | null;
  page?: number;
  limit?: number;
};

export function filterSampleProducts(query: ProductsQuery): { products: Array<CatalogProduct & { isSoldOut: boolean }>; pagination: { page: number; limit: number; total: number; pages: number } } {
  const page = query.page ?? 1;
  const limit = query.limit ?? 12;

  let list = [...SAMPLE_PRODUCTS];

  if (query.gender) list = list.filter((p) => p.gender === query.gender);
  if (query.category) list = list.filter((p) => p.category === query.category);
  if (query.featured) list = list.filter((p) => p.isFeatured);
  if (query.newArrivals) list = list.filter((p) => p.isNewArrival);
  if (query.size) list = list.filter((p) => p.sizes.some((s) => s.size === query.size));
  if (typeof query.minPrice === "number") list = list.filter((p) => p.price >= query.minPrice!);
  if (typeof query.maxPrice === "number") list = list.filter((p) => p.price <= query.maxPrice!);

  const sort = query.sort ?? "newest";
  if (sort === "price-low") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const skip = Math.max(0, (page - 1) * limit);
  list = list.slice(skip, skip + limit);

  return {
    products: list.map((p) => ({ ...p, isSoldOut: catalogSoldOut(p) })),
    pagination: { page, limit, total, pages },
  };
}

export function getSampleProductBySlug(slug: string): { product: (CatalogProduct & { isSoldOut: boolean }) | null; related: Array<CatalogProduct & { isSoldOut: boolean }> } {
  const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
  if (!product) return { product: null, related: [] };
  const related = SAMPLE_PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  return {
    product: { ...product, isSoldOut: catalogSoldOut(product) },
    related: related.map((p) => ({ ...p, isSoldOut: catalogSoldOut(p) })),
  };
}

export function searchSampleProducts(q: string): Array<CatalogProduct & { isSoldOut: boolean }> {
  const query = q.trim().toLowerCase();
  if (!query || query.length < 2) return [];
  const scored = SAMPLE_PRODUCTS.map((p) => {
    const name = p.name.toLowerCase();
    let score = 0;
    if (name === query) score = 100;
    else if (name.includes(query)) score = 50;
    else if (p.tags.some((t) => t.toLowerCase().includes(query))) score = 10;
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 6).map(({ p }) => ({ ...p, isSoldOut: catalogSoldOut(p) }));
}
