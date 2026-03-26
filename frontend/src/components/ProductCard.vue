<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cartStore'

const props = defineProps({
  product: { type: Object, required: true }
})

const cartStore = useCartStore()

async function addToCart() {
  await cartStore.addItem(props.product, 1)
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 flex flex-col">
    <img :src="product.image_url" :alt="product.name" class="h-48 w-full object-cover rounded-xl" />
    <h3 class="mt-3 font-semibold text-slate-900">{{ product.name }}</h3>
    <p class="text-sm text-slate-500 line-clamp-2">{{ product.description }}</p>
    <div class="mt-2 text-amber-500">★★★★☆</div>
    <p class="mt-1 text-lg font-bold text-primary">${{ product.price.toFixed(2) }}</p>
    <div class="mt-4 flex gap-2">
      <RouterLink
        :to="`/products/${product.id}`"
        class="flex-1 text-center border border-primary text-primary rounded-lg px-3 py-2 hover:bg-indigo-50 transition"
      >
        View
      </RouterLink>
      <button
        class="flex-1 bg-primary text-white rounded-lg px-3 py-2 shadow hover:bg-indigo-700 transition"
        @click="addToCart"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>
