<template>
  <div>
    <!-- Announcement Bar -->
    <div class="bg-[#ff6b00] text-white text-center py-2 text-sm font-medium">
      🎉 FREE SHIPPING ON ORDERS ABOVE ₹499
    </div>

    <!-- Navbar -->
    <Navbar />

    <!-- Hero Banner -->
    <HeroBanner @shopNow="shopNow" @newDrops="newDrops" />

    <!-- Category Strip -->
    <CategoryStrip :activeCategory="activeCategory" @select="selectCategory" />

    <!-- Trending Now Section -->
    <section class="container mx-auto px-4 py-12">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-black uppercase">TRENDING NOW</h2>
        <RouterLink to="/products" class="text-[#ff6b00] font-bold hover:underline">View All →</RouterLink>
      </div>
      <ProductGrid :products="featuredProducts" :loading="loading" />
    </section>

    <!-- Shop by Fandom Section -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-3xl font-black uppercase mb-6">SHOP BY FANDOM</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="fandom in fandoms"
          :key="fandom.name"
          @click="goToCategory(fandom.query)"
          class="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d0d] group-hover:scale-110 transition-transform duration-500"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <h3 class="text-4xl font-black text-white uppercase">{{ fandom.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Bestsellers Section -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-3xl font-black uppercase mb-6">BESTSELLERS</h2>
      <ProductGrid :products="bestsellerProducts" :loading="loading" />
    </section>

    <!-- Features Section -->
    <section class="bg-gray-100 py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-black uppercase mb-8 text-center">WHY SHOPZONE?</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-4xl mb-3">🚚</div>
            <h3 class="font-bold mb-2">Free Shipping</h3>
            <p class="text-sm text-gray-600">On orders above ₹499</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-3">↩️</div>
            <h3 class="font-bold mb-2">Easy Returns</h3>
            <p class="text-sm text-gray-600">15-day return policy</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-3">✅</div>
            <h3 class="font-bold mb-2">100% Official</h3>
            <p class="text-sm text-gray-600">Licensed merchandise</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-3">💵</div>
            <h3 class="font-bold mb-2">COD Available</h3>
            <p class="text-sm text-gray-600">Pay on delivery</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="bg-[#1a1a2e] text-white py-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-black mb-3">GET 10% OFF YOUR FIRST ORDER</h2>
        <p class="text-gray-400 mb-6">Subscribe to our newsletter for exclusive deals</p>
        <form class="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            class="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
          />
          <button
            type="submit"
            class="px-8 py-3 bg-[#ff6b00] rounded-lg font-bold hover:bg-[#ff8533] transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>

    <!-- Footer -->
    <Footer />

    <!-- Toast -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '../stores/productStore'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import HeroBanner from '../components/HeroBanner.vue'
import CategoryStrip from '../components/CategoryStrip.vue'
import ProductGrid from '../components/ProductGrid.vue'
import Toast from '../components/Toast.vue'

const router = useRouter()
const productStore = useProductStore()

const featuredProducts = ref([])
const bestsellerProducts = ref([])
const loading = ref(false)
const activeCategory = ref(null)

const fandoms = [
  { name: 'ANIME', query: 'subcategory=Anime' },
  { name: 'MARVEL/DC', query: 'subcategory=Marvel' },
  { name: 'MUSIC', query: 'subcategory=Music' },
  { name: 'SPORTS', query: 'subcategory=Sports' }
]

const loadFeaturedProducts = async () => {
  loading.value = true
  await productStore.fetchFeatured()
  featuredProducts.value = productStore.featured.slice(0, 8)

  // Load bestsellers
  await productStore.fetchProducts({ badge: 'BESTSELLER', per_page: 8 })
  bestsellerProducts.value = productStore.products
  loading.value = false
}

const shopNow = () => {
  router.push('/products')
}

const newDrops = () => {
  router.push('/products?badge=NEW')
}

const selectCategory = (category) => {
  activeCategory.value = category
  if (category) {
    router.push(`/products?category=${category}`)
  } else {
    router.push('/products')
  }
}

const goToCategory = (query) => {
  router.push(`/products?${query}`)
}

onMounted(() => {
  loadFeaturedProducts()
})
</script>
