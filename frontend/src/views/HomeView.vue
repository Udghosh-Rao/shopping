<template>
  <div>
    <Navbar />
    <HeroBanner />

    <section class="bg-[#0d0d0d] text-white py-4 overflow-hidden">
      <div class="container mx-auto px-4 flex gap-6 overflow-x-auto no-scrollbar whitespace-nowrap trust-scroll">
        <div v-for="item in trustItems" :key="item.title" class="inline-flex items-center gap-3 pr-6 border-r border-white/20">
          <span class="text-2xl">{{ item.icon }}</span>
          <div>
            <p class="font-bold text-sm">{{ item.title }}</p>
            <p class="text-xs text-gray-300">{{ item.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-4 py-12">
      <h2 class="text-center text-5xl" style="font-family: var(--font-display)">SHOP BY CATEGORY</h2>
      <p class="text-center text-gray-500 text-sm">Find your vibe</p>
      <div class="mt-7 flex gap-5 overflow-x-auto pb-2">
        <button v-for="cat in categories" :key="cat.name" @click="goCategory(cat.query)" class="min-w-[110px] text-center group">
          <div :class="['w-24 h-24 mx-auto rounded-full grid place-items-center text-4xl transition group-hover:scale-110 ring-0 group-hover:ring-4 ring-orange-300', cat.gradient]">{{ cat.emoji }}</div>
          <p class="mt-2 text-sm font-semibold">{{ cat.name }}</p>
        </button>
      </div>
    </section>

    <section class="container mx-auto px-4 py-10">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-5xl" style="font-family: var(--font-display)">TRENDING NOW</h2>
        <RouterLink to="/products" class="font-semibold text-orange-500">VIEW ALL →</RouterLink>
      </div>
      <ProductGrid :products="trending" :loading="loading" />
    </section>

    <FlashSale />

    <section class="mx-4 sm:mx-8 lg:mx-16 rounded-3xl bg-gradient-to-r from-[#0d0d0d] to-[#1a1a2e] text-white py-16 px-6 text-center">
      <h3 class="text-4xl sm:text-5xl max-w-4xl mx-auto" style="font-family: var(--font-display)">YOUR FAVOURITE SHOWS. YOUR FAVOURITE CHARACTERS. YOUR FAVOURITE TEES.</h3>
      <RouterLink to="/products" class="btn-primary mt-6">EXPLORE ALL →</RouterLink>
    </section>

    <section class="container mx-auto px-4 py-12">
      <h2 class="text-5xl" style="font-family: var(--font-display)">SHOP BY FANDOM</h2>
      <div class="mt-6 grid md:grid-cols-2 gap-4 overflow-x-auto">
        <button v-for="(f, i) in fandoms" :key="f.name" @click="goCategory(f.query)" :class="['relative min-h-[220px] md:min-h-[300px] rounded-2xl p-6 text-left overflow-hidden', f.bg]">
          <span class="absolute right-4 top-2 text-8xl font-black text-white/10">0{{ i + 1 }}</span>
          <span class="text-4xl">{{ f.icon }}</span>
          <h3 class="text-4xl mt-3 text-white" style="font-family: var(--font-display)">{{ f.name }}</h3>
          <p class="text-orange-300 mt-2 font-semibold">Shop Now →</p>
        </button>
      </div>
    </section>

    <section class="container mx-auto px-4 py-12">
      <h2 class="text-5xl" style="font-family: var(--font-display)">BESTSELLERS</h2>
      <p class="text-gray-500">Our most loved products</p>
      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="(product, idx) in bestsellers" :key="product.id" class="animate-fade-up" :style="{ animationDelay: `${idx * 100}ms` }">
          <ProductCard :product="product" />
        </div>
      </div>
    </section>

    <section class="bg-[#ff6b00] text-white overflow-hidden py-3">
      <div class="marquee-track whitespace-nowrap text-4xl" style="font-family: var(--font-display)">
        <span class="mr-8">FREE SHIPPING ✦ EASY RETURNS ✦ OFFICIAL LICENSED ✦ COD AVAILABLE ✦ FREE SHIPPING ✦ EASY RETURNS ✦ OFFICIAL LICENSED ✦ COD AVAILABLE ✦</span>
        <span>FREE SHIPPING ✦ EASY RETURNS ✦ OFFICIAL LICENSED ✦ COD AVAILABLE ✦ FREE SHIPPING ✦ EASY RETURNS ✦ OFFICIAL LICENSED ✦ COD AVAILABLE ✦</span>
      </div>
    </section>

    <section v-if="recentlyViewed.length" class="container mx-auto px-4 py-12">
      <h2 class="text-5xl" style="font-family: var(--font-display)">RECENTLY VIEWED</h2>
      <div class="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <ProductCard v-for="item in recentlyViewed" :key="item.id" :product="item" />
      </div>
    </section>

    <section class="bg-[#f9f9f9] py-12">
      <div class="container mx-auto px-4">
        <h2 class="text-center text-5xl" style="font-family: var(--font-display)">LOVED BY 6 MILLION+ FANS</h2>
        <div class="mt-6 grid md:grid-cols-3 gap-4">
          <div v-for="review in socialProof" :key="review.name" class="bg-white rounded-2xl p-5 shadow-sm">
            <p class="text-orange-500 text-lg">★★★★★</p>
            <p class="mt-3 text-sm text-gray-700">{{ review.text }}</p>
            <p class="mt-4 font-semibold">{{ review.name }} <span class="text-green-500 text-xs">✔ Verified</span></p>
            <p class="text-xs text-gray-500">Bought: {{ review.product }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#0d0d0d] text-white py-12">
      <div class="container mx-auto px-4 grid lg:grid-cols-2 gap-6 items-center">
        <div>
          <h3 class="text-5xl" style="font-family: var(--font-display)">GET 10% OFF YOUR FIRST ORDER</h3>
          <p class="text-gray-400 mt-2">Subscribe for exclusive deals, new drops & more</p>
        </div>
        <form class="flex gap-2" @submit.prevent="subscribe">
          <input v-model="email" type="email" class="input-field" placeholder="Enter email" required />
          <button class="btn-primary" type="submit">SUBSCRIBE</button>
        </form>
        <p v-if="subscribed" class="text-green-400 text-sm lg:col-span-2">✅ Thanks! You're subscribed.</p>
      </div>
    </section>

    <Footer />
    <Toast />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FlashSale from '../components/FlashSale.vue'
import Footer from '../components/Footer.vue'
import HeroBanner from '../components/HeroBanner.vue'
import Navbar from '../components/Navbar.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductGrid from '../components/ProductGrid.vue'
import Toast from '../components/Toast.vue'
import api from '../services/api'

const router = useRouter()
const loading = ref(false)
const trending = ref([])
const bestsellers = ref([])
const recentlyViewed = ref([])
const email = ref('')
const subscribed = ref(false)

const trustItems = [
  { icon: '🚚', title: 'Free Delivery above ₹499', sub: 'Across India' },
  { icon: '🔄', title: 'Easy 15-Day Returns', sub: 'No questions asked' },
  { icon: '✅', title: '100% Official Licensed', sub: 'Authentic drops only' },
  { icon: '💳', title: 'Cash on Delivery', sub: 'Pay at doorstep' },
  { icon: '🔒', title: '100% Secure Payments', sub: 'Trusted checkout' }
]

const categories = [
  { name: 'T-Shirts', emoji: '👕', query: 'T-Shirts', gradient: 'bg-gradient-to-br from-orange-300 to-orange-500' },
  { name: 'Shirts', emoji: '👔', query: 'Shirts', gradient: 'bg-gradient-to-br from-blue-300 to-blue-500' },
  { name: 'Joggers', emoji: '🩳', query: 'Joggers', gradient: 'bg-gradient-to-br from-purple-300 to-purple-600' },
  { name: 'Shorts', emoji: '🩳', query: 'Shorts', gradient: 'bg-gradient-to-br from-cyan-300 to-cyan-500' },
  { name: 'Hoodies', emoji: '🧥', query: 'Hoodies', gradient: 'bg-gradient-to-br from-indigo-300 to-indigo-600' },
  { name: 'Jackets', emoji: '🧥', query: 'Jackets', gradient: 'bg-gradient-to-br from-slate-300 to-slate-600' },
  { name: 'Sneakers', emoji: '👟', query: 'Sneakers', gradient: 'bg-gradient-to-br from-green-300 to-green-600' },
  { name: 'Track Pants', emoji: '👖', query: 'Joggers', gradient: 'bg-gradient-to-br from-teal-300 to-teal-600' }
]

const fandoms = [
  { name: 'ANIME', icon: '🗡️', query: 'subcategory=Anime', bg: 'bg-[#0f172a]' },
  { name: 'MARVEL & DC', icon: '🦸', query: 'subcategory=Marvel', bg: 'bg-[#3b0a0a]' },
  { name: 'MUSIC', icon: '🎵', query: 'subcategory=Music', bg: 'bg-[#2e1065]' },
  { name: 'SPORTS', icon: '🏆', query: 'subcategory=Sports', bg: 'bg-[#14532d]' }
]

const socialProof = [
  { name: 'Aarav M.', text: 'Amazing quality and super fast delivery. The print is top-notch.', product: 'Demon Slayer Tee' },
  { name: 'Nisha R.', text: 'My sneaker order was perfect. Will definitely shop again!', product: 'White Canvas Sneakers' },
  { name: 'Kunal P.', text: 'Best fandom collection in India. Love the fit and finish.', product: 'Marvel Oversized Tee' }
]

function goCategory(query) {
  if (query.includes('=')) {
    router.push(`/products?${query}`)
    return
  }
  router.push(`/products?category=${encodeURIComponent(query)}`)
}

function subscribe() {
  subscribed.value = true
  email.value = ''
}

async function loadHome() {
  loading.value = true
  const [featured, best] = await Promise.all([
    api.get('/products', { params: { featured: true, per_page: 8 } }),
    api.get('/products', { params: { badge: 'BESTSELLER', per_page: 8 } })
  ])
  trending.value = featured.data.products || []
  bestsellers.value = best.data.products || []

  const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]').slice(0, 6)
  if (ids.length) {
    const { data } = await api.get('/products/bulk', { params: { ids: ids.join(',') } })
    recentlyViewed.value = data
  }

  loading.value = false
}

onMounted(loadHome)
</script>

<style scoped>
@media (max-width: 768px) {
  .trust-scroll {
    animation: marquee 14s linear infinite;
    width: max-content;
  }
}
</style>
