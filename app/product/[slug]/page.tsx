import { getSampleProductBySlug } from '@/lib/sampleCatalog';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productSchema } from '@/lib/structuredData';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { product } = getSampleProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { product, related } = getSampleProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Mock reviews for schema (in production, fetch from DB)
  const mockReviews = [
    { rating: 5 },
    { rating: 4 },
    { rating: 5 },
  ];

  // Generate JSON-LD schema
  const schema = productSchema(product as any, mockReviews);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={related}
      />
    </>
  );
}

// Regenerate product pages every hour
export const revalidate = 3600;
