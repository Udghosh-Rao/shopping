'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cartStore';
import toast from 'react-hot-toast';
import ProductCard from '@/components/store/ProductCard';
import Link from 'next/link';
import SizeGuide from '@/components/ui/SizeGuide';
import RestockNotify from '@/components/ui/RestockNotify';
import CountdownTimer from '@/components/ui/CountdownTimer';
import RecentlyViewed from '@/components/store/RecentlyViewed';
import { addRecentlyViewed } from '@/lib/recentlyViewed';
import ReviewSection from '@/components/reviews/ReviewSection';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  gender: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: { size: string; stock: number }[];
  stock: number;
  tags: string[];
  careInstructions?: string;
}

interface Props {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'care'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const selectedSizeStock =
    product.sizes.find((s) => s.size === selectedSize)?.stock || 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (selectedSizeStock === 0) {
      toast.error('This size is out of stock');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || '',
      size: selectedSize,
      quantity,
      price: product.price,
      discountPrice: product.discountPrice,
    });
    toast.success('Added to cart!');
  };

  useEffect(() => {
    addRecentlyViewed({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      discountPrice: product.discountPrice,
      images: product.images,
      category: product.category,
      gender: product.gender,
      isNewArrival: false,
      sizes: product.sizes,
    });
  }, [product]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--skeleton)]"
            layoutId={`product-${product.slug}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                {product.images[selectedImage] && (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {discount > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-accent text-white text-sm font-bold rounded-xl">
                {discount}% OFF
              </span>
            )}
          </motion.div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? 'border-accent'
                      : 'border-transparent hover:border-[var(--border)]'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted uppercase tracking-wider mb-1">
              {product.gender} / {product.category}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl sm:text-3xl font-bold">
                    ₹{product.discountPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-muted line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="px-2.5 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-lg">
                    Save ₹{(product.price - product.discountPrice).toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-sm text-muted mt-1">Inclusive of all taxes</p>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Select Size</h3>
              <SizeGuide />
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  onClick={() => setSelectedSize(s.size)}
                  disabled={s.stock === 0}
                  className={`min-w-[3rem] px-4 py-2.5 text-sm rounded-xl border font-medium transition-all ${
                    selectedSize === s.size
                      ? 'bg-foreground text-background border-foreground'
                      : s.stock === 0
                      ? 'border-[var(--border)] text-muted opacity-40 cursor-not-allowed line-through'
                      : 'border-[var(--border)] hover:border-foreground'
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {selectedSize && selectedSizeStock > 0 && selectedSizeStock <= 5 && (
              <p className="text-sm text-accent mt-2 font-medium">
                Only {selectedSizeStock} left in stock!
              </p>
            )}
          </div>

          {product.discountPrice && <CountdownTimer hoursFromNow={6} />}

          {product.stock <= 0 && <RestockNotify productName={product.name} />}

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="inline-flex items-center border border-[var(--border)] rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-[var(--input-bg)] transition-colors rounded-l-xl"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-[var(--input-bg)] transition-colors rounded-r-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-foreground text-background font-semibold rounded-xl hover:bg-accent hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsWishlisted(!isWishlisted);
                toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
              }}
              className={`w-14 h-14 flex items-center justify-center rounded-xl border transition-all ${
                isWishlisted
                  ? 'bg-accent border-accent text-white'
                  : 'border-[var(--border)] hover:border-accent hover:text-accent'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="border-t border-[var(--border)] pt-6">
            <div className="flex gap-6 border-b border-[var(--border)]">
              {(['description', 'care'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab ? 'text-foreground' : 'text-muted hover:text-foreground'
                  }`}
                >
                  {tab === 'description' ? 'Description' : 'Care Instructions'}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="product-tab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="pt-4 text-sm text-muted leading-relaxed">
              {activeTab === 'description' ? (
                <p>{product.description}</p>
              ) : (
                <p>{product.careInstructions || 'No care instructions available.'}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/shop?q=${tag}`}
                  className="px-3 py-1 text-xs bg-[var(--input-bg)] text-muted rounded-lg hover:text-foreground transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Customer Reviews */}
      <ReviewSection productId={product._id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-20">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed />
    </div>
  );
}
