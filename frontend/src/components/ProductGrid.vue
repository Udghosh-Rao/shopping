<template>
  <div>
    <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
    <div v-else-if="!loading" class="text-center py-16">
      <p class="text-gray-500 text-lg">No products found</p>
    </div>
    <LoadingSpinner v-if="loading" />
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  products: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
