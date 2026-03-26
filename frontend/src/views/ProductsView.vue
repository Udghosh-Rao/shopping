<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filters (Desktop) -->
        <div class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow p-6 sticky top-20">
            <h3 class="font-bold text-lg mb-4">FILTERS</h3>

            <!-- Category Filter -->
            <div class="mb-6">
              <h4 class="font-bold text-sm mb-2">CATEGORY</h4>
              <div class="space-y-2">
                <label v-for="cat in categories" :key="cat" class="flex items-center">
                  <input type="checkbox" :value="cat" v-model="selectedCategories" class="mr-2" />
                  <span class="text-sm">{{ cat }}</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h4 class="font-bold text-sm mb-2">PRICE RANGE</h4>
              <div class="space-y-2">
                <input v-model.number="minPrice" type="number" placeholder="Min" class="w-full px-3 py-2 border rounded" />
                <input v-model.number="maxPrice" type="number" placeholder="Max" class="w-full px-3 py-2 border rounded" />
              </div>
            </div>

            <!-- Sort -->
            <div class="mb-6">
              <h4 class="font-bold text-sm mb-2">SORT BY</h4>
              <select v-model="sortBy" class="w-full px-3 py-2 border rounded">
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <button @click="applyFilters" class="w-full bg-black text-white py-2 rounded font-bold hover:bg-gray-800 transition">
              APPLY FILTERS
            </button>
            <button @click="clearFilters" class="w-full mt-2 border border-gray-300 py-2 rounded font-bold hover:bg-gray-50 transition">
              CLEAR ALL
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <!-- Search Bar -->
          <div class="mb-6">
            <SearchBar @search="handleSearch" />
          </div>

          <!-- Results Info -->
          <div class="mb-6 flex justify-between items-center">
            <p class="text-gray-600">
              Showing <span class="font-bold">{{ products.length }}</span> products
            </p>
          </div>

          <!-- Products Grid -->
          <ProductGrid :products="products" :loading="loading" />

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8 flex justify-center gap-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'px-4 py-2 border rounded',
                currentPage === page ? 'bg-black text-white' : 'hover:bg-gray-100'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import SearchBar from '../components/SearchBar.vue'
import ProductGrid from '../components/ProductGrid.vue'
import Toast from '../components/Toast.vue'

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

const categories = ['T-Shirts', 'Shirts', 'Joggers', 'Sneakers', 'Phone Cases', 'Posters', 'Accessories', 'Mugs']

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
  currentPage.value = 1
  router.push('/products')
  fetchProducts()
}

const handleSearch = (query) => {
  router.push(`/products?search=${query}`)
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

onMounted(() => {
  fetchProducts()
})
</script>
