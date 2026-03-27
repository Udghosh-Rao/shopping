<template>
  <div>
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="n in skeletonCount" :key="n" class="skeleton aspect-[4/5] rounded-md" />
    </div>

    <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard v-for="(product, index) in products" :key="product.id" :product="product" :index="index" />
    </div>

    <div v-else class="flex flex-col items-center justify-center py-24 text-center">
      <span class="text-6xl mb-4 anim-float block">🛍️</span>
      <p class="text-xl font-bold font-display tracking-widest text-white">NO PRODUCTS FOUND</p>
      <p class="text-gray-500 text-sm mt-2">Try a different filter or search term.</p>
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  skeletonCount: { type: Number, default: 8 }
})
</script>
