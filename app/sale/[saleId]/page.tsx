"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Loader2, ShoppingBag } from "lucide-react";
import SaleCountdown from "@/components/sales/SaleCountdown";
import { useCart } from "@/lib/cartStore";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  description: string;
}

interface Sale {
  _id: string;
  name: string;
  discountPercent: number;
  endTime: string;
  productIds: string[];
  description?: string;
}

export default function SalePage() {
  const params = useParams();
  const saleId = (params?.saleId as string) || "";
  const [sale, setSale] = useState<Sale | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    if (!saleId) return;
    fetchSale();
  }, [saleId]);

  const fetchSale = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sales/${saleId}`);
      if (res.ok) {
        const data = await res.json();
        setSale(data.sale);
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Failed to fetch sale:", error);
      toast.error("Failed to load sale");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    const discountedPrice = sale
      ? product.price * (1 - sale.discountPercent / 100)
      : product.price;

    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: discountedPrice,
      image: product.images[0],
      size: "M",
      quantity: 1,
    });
    toast.success("Added to cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Sale not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-[#E63946] to-red-700 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-3">{sale.name}</h1>
              <p className="text-lg md:text-xl font-bold mb-4">
                Save up to {sale.discountPercent}% on selected items
              </p>
              {sale.description && (
                <p className="text-white/90">{sale.description}</p>
              )}
            </div>
            <div className="flex-shrink-0 text-center">
              <p className="text-sm font-bold mb-2">OFFER ENDS IN</p>
              <SaleCountdown endTime={sale.endTime} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-black mb-8">
            {products.length} Products on Sale
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products in this sale yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const discountedPrice = product.price * (1 - sale.discountPercent / 100);

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-[#E63946] text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{sale.discountPercent}%
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <h3 className="font-bold text-gray-900 line-clamp-2 text-sm">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-[#E63946]">
                          ₹{discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full px-4 py-2 bg-[#E63946] text-white rounded-lg font-bold text-sm hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
