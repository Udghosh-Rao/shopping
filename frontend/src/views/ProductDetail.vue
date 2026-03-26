<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import { useCartStore } from '../stores/cartStore'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
const product = ref(null)
const quantity = ref(1)

const related = computed(() =>
  productStore.products
    .filter((p) => product.value && p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
)

async function loadProduct() {
  product.value = await productStore.fetchById(route.params.id)
  await productStore.fetchProducts({ category: product.value.category })
}

async function addToCart() {
  await cartStore.addItem(product.value, quantity.value)
}

onMounted(loadProduct)
</script>

<template>
  <div v-if="product" class="grid md:grid-cols-2 gap-6 bg-white rounded-2xl p-6 shadow-md">
    <img :src="product.image_url" :alt="product.name" class="w-full h-96 object-cover rounded-xl" />
    <div>
      <h1 class="text-3xl font-bold">{{ product.name }}</h1>
      <p class="mt-3 text-slate-600">{{ product.description }}</p>
      <p class="mt-4 text-2xl font-bold text-primary">${{ product.price.toFixed(2) }}</p>
      <p class="text-sm text-slate-500 mt-1">Stock: {{ product.stock }}</p>

      <div class="mt-5 flex items-center gap-2">
        <label class="text-sm">Qty</label>
        <input
          v-model.number="quantity"
          type="number"
          min="1"
          :max="product.stock"
          class="w-20 border rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        class="mt-5 bg-primary text-white px-5 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
        @click="addToCart"
      >
        Add to Cart
      </button>
    </div>
  </div>

  <div class="mt-10">
    <h2 class="text-2xl font-bold mb-4">Related Products</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="item in related" :key="item.id" class="bg-white p-4 rounded-2xl shadow-md">
        <img :src="item.image_url" class="h-36 w-full object-cover rounded-lg" />
        <p class="mt-2 font-medium">{{ item.name }}</p>
        <p class="text-primary font-bold">${{ item.price.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>
