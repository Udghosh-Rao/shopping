<script setup>
import { onMounted, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProductStore } from '../stores/productStore'

const store = useProductStore()
const search = ref('')
const selectedCategory = ref('')

async function applyFilters() {
  await store.searchProducts(search.value, selectedCategory.value)
}

onMounted(async () => {
  await store.fetchProducts()
})
</script>

<template>
  <section>
    <div class="bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-2xl p-8 text-white shadow">
      <h1 class="text-3xl md:text-5xl font-bold">Shop smarter with ShopVue</h1>
      <p class="mt-2 text-indigo-100">Discover premium products at great prices.</p>
      <RouterLink
        to="/"
        class="inline-block mt-5 bg-accent px-5 py-3 rounded-lg shadow hover:bg-orange-600 transition"
      >
        Shop Now
      </RouterLink>
    </div>

    <div class="mt-6 bg-white rounded-2xl p-4 shadow-md">
      <div class="flex flex-col md:flex-row gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="Search products"
          class="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
        <button
          class="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          @click="applyFilters"
        >
          Search
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          class="px-3 py-1 rounded-lg border hover:bg-indigo-50"
          :class="selectedCategory === '' ? 'bg-primary text-white border-primary' : ''"
          @click="selectedCategory = ''; applyFilters()"
        >
          All
        </button>
        <button
          v-for="category in store.categories"
          :key="category"
          class="px-3 py-1 rounded-lg border hover:bg-indigo-50"
          :class="selectedCategory === category ? 'bg-primary text-white border-primary' : ''"
          @click="selectedCategory = category; applyFilters()"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <h2 class="text-2xl font-bold mt-8 mb-4">Featured Products</h2>
    <div v-if="store.loading" class="text-slate-600">Loading products...</div>
    <div v-else-if="store.error" class="text-red-600">{{ store.error }}</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ProductCard v-for="product in store.products" :key="product.id" :product="product" />
    </div>
  </section>
</template>
