import { IProduct } from '@/models/Product';

export function productSchema(product: IProduct, reviews: any[] = []) {
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      '@type': 'Brand',
      name: 'Shopping Store',
    },
    offers: {
      '@type': 'Offer',
      url: `/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.discountPrice || product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Shopping Store',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: reviews.length,
    },
    category: product.category,
  };
}

export function productCollectionSchema(products: IProduct[], category: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category} Collection`,
    description: `Browse our collection of ${category}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `/product/${product.slug}`,
        name: product.name,
        image: product.images[0],
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.discountPrice || product.price,
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      })),
    },
  };
}
