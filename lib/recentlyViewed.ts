export interface RecentlyViewedProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category?: string;
  gender?: string;
  isNewArrival?: boolean;
  sizes?: { size: string; stock: number }[];
}

export function addRecentlyViewed(product: RecentlyViewedProduct) {
  const key = "recently_viewed";
  const existing = JSON.parse(localStorage.getItem(key) || "[]") as RecentlyViewedProduct[];
  const filtered = existing.filter((p) => p._id !== product._id);
  const updated = [product, ...filtered].slice(0, 6);
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getRecentlyViewed(): RecentlyViewedProduct[] {
  return JSON.parse(localStorage.getItem("recently_viewed") || "[]");
}
