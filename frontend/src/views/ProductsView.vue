<template>
  <div class="bg-[var(--black)] min-h-screen text-white pt-24 pb-20">
    <div class="container mx-auto px-6 max-w-[1600px]">
      
      <!-- Page Header -->
      <div class="mb-12 border-b border-white/10 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 class="text-5xl md:text-7xl font-display font-black tracking-[0.1em] uppercase mb-2">COLLECTION</h1>
          <p class="text-gray-400 text-sm tracking-widest uppercase font-bold">Showing <span class="text-white">{{ products.length }}</span> items</p>
        </div>
        
        <!-- Search -->
        <div class="w-full md:w-auto min-w-[300px]">
          <div class="relative">
            <input 
              v-model="searchQuery" 
              @keyup.enter="handleSearch(searchQuery)"
              type="text" 
              placeholder="SEARCH PIECES..." 
              class="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm text-white focus:border-neon-orange outline-none transition-colors font-bold tracking-widest uppercase"
            />
            <span class="absolute right-0 top-3 text-gray-500">🔍</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-12">
        <!-- Sidebar Filters -->
        <aside class="lg:w-72 flex-shrink-0">
          <div class="sticky top-28 bg-[var(--dark-2)] border border-white/5 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm">
            <h3 class="font-display font-black tracking-[0.2em] text-lg mb-8 uppercase text-white">FILTERS</h3>

            <!-- Category Filter -->
            <div class="mb-10">
              <h4 class="font-bold text-xs tracking-widest text-gray-500 mb-5 uppercase">Category</h4>
              <div class="flex flex-col gap-4">
                <label v-for="cat in categories" :key="cat" class="flex items-center group cursor-pointer">
                  <div class="relative flex items-center justify-center w-5 h-5 border border-white/20 mr-4 group-hover:border-neon-orange transition-colors">
                    <input type="checkbox" :value="cat" v-model="selectedCategories" class="opacity-0 absolute inset-0 cursor-pointer" />
                    <span v-if="selectedCategories.includes(cat)" class="w-3 h-3 bg-neon-orange"></span>
                  </div>
                  <span class="text-sm font-bold text-gray-400 group-hover:text-white transition-colors tracking-widest uppercase">{{ cat }}</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-10">
              <h4 class="font-bold text-xs tracking-widest text-gray-500 mb-5 uppercase">Price Limit</h4>
              <div class="flex items-center gap-3">
                <input v-model.number="minPrice" type="number" placeholder="MIN" class="w-full bg-black/50 border border-white/10 px-4 py-3 text-xs font-bold tracking-widest text-white focus:border-neon-orange outline-none transition-colors" />
                <span class="text-gray-500 font-bold">-</span>
                <input v-model.number="maxPrice" type="number" placeholder="MAX" class="w-full bg-black/50 border border-white/10 px-4 py-3 text-xs font-bold tracking-widest text-white focus:border-neon-orange outline-none transition-colors" />
              </div>
            </div>

            <!-- Sort -->
            <div class="mb-10">
              <h4 class="font-bold text-xs tracking-widest text-gray-500 mb-5 uppercase">Sort By</h4>
              <select v-model="sortBy" class="w-full bg-black/50 border border-white/10 px-4 py-4 text-xs font-bold tracking-widest text-white focus:border-neon-orange outline-none transition-colors appearance-none cursor-pointer uppercase">
                <option value="newest" class="bg-[var(--dark-2)]">Newest Releases</option>
                <option value="price_asc" class="bg-[var(--dark-2)]">Price: Ascending</option>
                <option value="price_desc" class="bg-[var(--dark-2)]">Price: Descending</option>
                <option value="rating" class="bg-[var(--dark-2)]">Highest Rated</option>
              </select>
            </div>

            <button @click="applyFilters" class="w-full bg-white text-black py-4 font-bold tracking-[0.2em] text-xs uppercase hover:bg-gray-200 transition-colors mb-4">
              Apply Filters
            </button>
            <button @click="clearFilters" class="w-full bg-transparent border border-white/20 text-white py-4 font-bold tracking-[0.2em] text-xs uppercase hover:bg-white/5 transition-colors">
              Reset All
            </button>
          </div>
        </aside>

        <!-- Main Content (Products Grid) -->
        <div class="flex-1">
          <ProductGrid :products="products" :loading="loading" />

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-20 flex justify-center gap-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="w-12 h-12 flex items-center justify-center border border-white/10 text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              ←
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              class="w-12 h-12 flex items-center justify-center border font-display text-lg font-bold transition-colors"
              :class="currentPage === page ? 'border-neon-orange text-neon-orange' : 'border-white/10 text-white hover:bg-white/5'"
            >
              {{ page }}
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="w-12 h-12 flex items-center justify-center border border-white/10 text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import ProductGrid from '../components/ProductGrid.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const products = ref([])
const loading = ref(false)
const selectedCategories = ref([])
const minPrice = ref(null)
const maxPrice = ref(null)
const sortBy = ref('newest')
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref(route.query.search || '')

// Modified categories to match premium streetwear aesthetic
const categories = ['Outerwear', 'Hoodies', 'Sweaters', 'T-Shirts', 'Pants', 'Sneakers', 'Accessories']

const fetchProducts = async () => {
  loading.value = true
  const params = {
    page: currentPage.value,
    per_page: 12,
    sort: sortBy.value
  }

  if (route.query.category) params.category = route.query.category
  if (route.query.search) params.search = route.query.search
  if (route.query.badge) params.badge = route.query.badge
  if (selectedCategories.value.length > 0) params.category = selectedCategories.value[0]
  if (minPrice.value) params.min_price = minPrice.value
  if (maxPrice.value) params.max_price = maxPrice.value

  await productStore.fetchProducts(params)
  // Store updates directly
  products.value = productStore.products
  totalPages.value = productStore.totalPages
  loading.value = false
}

const applyFilters = () => {
  currentPage.value = 1
  fetchProducts()
}

const clearFilters = () => {
  selectedCategories.value = []
  minPrice.value = null
  maxPrice.value = null
  sortBy.value = 'newest'
  searchQuery.value = ''
  currentPage.value = 1
  router.push('/products')
  fetchProducts()
}

const handleSearch = (query) => {
  router.push(`/shop?search=${query}`)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

watch(() => route.query, () => {
  fetchProducts()
}, { immediate: true })
</script>

<style scoped>
/* Ensure number inputs don't have arrows in WebKit */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}

/* Custom appearance for dark mode select */
select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}
</style>
