<template>
  <header class="sticky top-0 z-50">
    <Transition name="fade">
      <div v-if="showAnnouncement" class="bg-[#ff6b00] text-white text-xs sm:text-sm">
        <div class="container mx-auto px-4 py-2 flex items-center justify-center gap-3 relative">
          <p class="animate-fade-in font-semibold tracking-wide">{{ announcements[currentAnnouncement] }}</p>
          <button class="absolute right-4 hover:opacity-80" @click="dismissAnnouncement">✕</button>
        </div>
      </div>
    </Transition>

    <nav
      :class="[
        'bg-[#0d0d0d] text-white transition-all duration-300',
        scrolled ? 'backdrop-blur-md bg-[#0d0d0d]/90 shadow-2xl h-[60px]' : 'h-[72px]'
      ]"
    >
      <div class="container mx-auto px-4 h-full flex items-center justify-between gap-3">
        <button class="lg:hidden text-2xl" @click="mobileOpen = true">☰</button>

        <RouterLink to="/" class="leading-none">
          <p class="text-3xl font-black bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text" style="font-family: var(--font-display)">SHOPZONE</p>
          <p class="text-[10px] tracking-[0.2em] text-gray-400 -mt-1">WEAR YOUR FANDOM</p>
        </RouterLink>

        <div class="hidden lg:flex items-center gap-6 text-sm font-semibold uppercase tracking-wide relative">
          <div class="relative" @mouseenter="activeMega = 'men'" @mouseleave="activeMega = ''">
            <button class="hover:text-orange-400">Men</button>
            <Transition name="fade-up">
              <div v-if="activeMega === 'men'" class="absolute top-9 left-0 w-[760px] bg-white text-black rounded-2xl shadow-2xl p-8 z-50">
                <div class="grid grid-cols-3 gap-8">
                  <div>
                    <p class="font-black mb-3">TOPS</p>
                    <ul class="space-y-2 text-sm">
                      <li v-for="item in ['T-Shirts','Oversized','Shirts','Hoodies','Jackets']" :key="item"><RouterLink :to="`/products?category=${item}`" class="hover:text-orange-500">{{ item }}</RouterLink></li>
                    </ul>
                  </div>
                  <div>
                    <p class="font-black mb-3">BOTTOMS</p>
                    <ul class="space-y-2 text-sm">
                      <li v-for="item in ['Joggers','Shorts','Jeans','Track Pants']" :key="item"><RouterLink :to="`/products?category=${item}`" class="hover:text-orange-500">{{ item }}</RouterLink></li>
                    </ul>
                  </div>
                  <div class="rounded-xl p-6 text-white bg-gradient-to-br from-[#1a1a2e] to-[#0d0d0d]">
                    <p class="text-xs tracking-[0.2em] text-orange-300">NEW SEASON</p>
                    <h4 class="text-4xl mt-2" style="font-family: var(--font-display)">DROP IS LIVE</h4>
                    <RouterLink to="/products?sort=newest" class="btn-primary mt-4">Shop Now</RouterLink>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="relative" @mouseenter="activeMega = 'women'" @mouseleave="activeMega = ''">
            <button class="hover:text-orange-400">Women</button>
            <div v-if="activeMega === 'women'" class="absolute top-9 left-0 bg-white text-black rounded-xl shadow-xl p-5 min-w-56">
              <ul class="space-y-2 text-sm">
                <li><RouterLink to="/products?category=T-Shirts" class="hover:text-orange-500">T-Shirts</RouterLink></li>
                <li><RouterLink to="/products?category=Shirts" class="hover:text-orange-500">Shirts</RouterLink></li>
                <li><RouterLink to="/products?category=Joggers" class="hover:text-orange-500">Joggers</RouterLink></li>
              </ul>
            </div>
          </div>

          <div class="relative" @mouseenter="activeMega = 'sneakers'" @mouseleave="activeMega = ''">
            <button class="hover:text-orange-400">Sneakers</button>
            <div v-if="activeMega === 'sneakers'" class="absolute top-9 left-0 bg-white text-black rounded-xl shadow-xl p-5 min-w-56">
              <ul class="space-y-2 text-sm">
                <li><RouterLink to="/products?category=Sneakers" class="hover:text-orange-500">High Top</RouterLink></li>
                <li><RouterLink to="/products?category=Sneakers" class="hover:text-orange-500">Low Top</RouterLink></li>
                <li><RouterLink to="/products?category=Sneakers" class="hover:text-orange-500">Canvas</RouterLink></li>
              </ul>
            </div>
          </div>

          <RouterLink to="/products?subcategory=Anime" class="hover:text-orange-400">Collections</RouterLink>
          <RouterLink to="/products?badge=SALE" class="text-red-500 flex items-center gap-2"><span class="w-2 h-2 bg-red-500 rounded-full animate-blink-dot"></span>Sale</RouterLink>
          <RouterLink to="/products?badge=NEW" class="text-orange-400 flex items-center gap-2"><span class="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>New Drops</RouterLink>
        </div>

        <div class="flex items-center gap-4 text-lg">
          <button @click="searchOpen = true" title="Search">🔍</button>
          <RouterLink to="/wishlist" class="relative" title="Wishlist">❤️<span v-if="wishlistCount" class="absolute -top-2 -right-3 text-[10px] bg-orange-500 w-4 h-4 rounded-full flex items-center justify-center">{{ wishlistCount }}</span></RouterLink>
          <div class="relative hidden sm:block">
            <button @click="accountOpen = !accountOpen">👤</button>
            <div v-if="accountOpen" class="absolute right-0 mt-3 bg-white text-black rounded-xl shadow-xl w-44 p-2 z-50">
              <RouterLink v-if="!authStore.isLoggedIn" to="/login" class="block px-3 py-2 hover:bg-gray-100 rounded-lg">Login</RouterLink>
              <template v-else>
                <p class="px-3 py-2 text-sm font-semibold">{{ authStore.username }}</p>
                <RouterLink to="/wishlist" class="block px-3 py-2 hover:bg-gray-100 rounded-lg">Wishlist</RouterLink>
                <button @click="authStore.logout(); accountOpen = false" class="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-red-500">Logout</button>
              </template>
            </div>
          </div>
          <button @click="cartOpen = true" class="relative" title="Cart">🛍️<span v-if="cartStore.totalItems" class="absolute -top-2 -right-3 text-[10px] bg-orange-500 w-4 h-4 rounded-full flex items-center justify-center">{{ cartStore.totalItems }}</span></button>
        </div>
      </div>
    </nav>

    <div class="hidden lg:block bg-[#1a1a1a] border-t border-white/10">
      <div class="container mx-auto px-4 py-2 overflow-x-auto whitespace-nowrap">
        <button v-for="cat in categories" :key="cat" @click="goCategory(cat)" class="text-sm px-4 py-1.5 mr-2 text-gray-300 hover:text-orange-400 border-b-2 border-transparent hover:border-orange-400 transition">{{ cat }}</button>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="searchOpen" class="fixed inset-0 bg-black/80 z-[120] p-6" @click.self="searchOpen = false">
        <div class="max-w-3xl mx-auto mt-20">
          <input
            v-model="search"
            @input="handleSearch"
            @keydown.esc="searchOpen = false"
            type="text"
            class="w-full bg-transparent border-b-2 border-white text-white text-2xl py-3 outline-none"
            placeholder="Search products..."
          />
          <div class="mt-4 flex gap-2 flex-wrap">
            <button v-for="tag in ['Oversized Tee','Hoodie','Sneakers']" :key="tag" @click="quickSearch(tag)" class="px-3 py-1 rounded-full bg-white/10 text-white text-sm">{{ tag }}</button>
          </div>
          <div v-if="searchResults.length" class="bg-white rounded-xl mt-5 p-2 max-h-80 overflow-auto">
            <button v-for="item in searchResults" :key="item.id" @click="openProduct(item.id)" class="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex justify-between">
              <span>{{ item.name }}</span>
              <span class="font-bold">₹{{ item.price }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="slide-left">
      <div v-if="mobileOpen" class="fixed inset-0 z-[130] bg-black/60" @click.self="mobileOpen = false">
        <aside class="w-[88%] max-w-sm h-full bg-[#0d0d0d] text-white p-5 overflow-y-auto">
          <div class="flex items-center justify-between">
            <p class="text-3xl" style="font-family: var(--font-display)">SHOPZONE</p>
            <button @click="mobileOpen = false" class="text-2xl">✕</button>
          </div>
          <RouterLink :to="authStore.isLoggedIn ? '/wishlist' : '/login'" class="mt-5 block bg-white/10 rounded-xl p-3">{{ authStore.isLoggedIn ? `Hi, ${authStore.username}` : 'Login / Register' }}</RouterLink>

          <div class="mt-5 space-y-2">
            <div v-for="section in mobileSections" :key="section.title" class="border border-white/10 rounded-xl overflow-hidden">
              <button @click="toggleAccordion(section.title)" class="w-full text-left px-4 py-3 flex justify-between">{{ section.title }} <span>{{ openAccordion === section.title ? '−' : '+' }}</span></button>
              <div v-if="openAccordion === section.title" class="bg-white/5 px-4 py-2 space-y-2 text-sm">
                <RouterLink v-for="sub in section.items" :key="sub" :to="`/products?category=${sub}`" class="block py-1" @click="mobileOpen = false">{{ sub }}</RouterLink>
              </div>
            </div>
          </div>

          <div class="mt-8 grid grid-cols-3 gap-3 text-center text-sm">
            <button @click="cartOpen = true; mobileOpen = false" class="bg-white/10 rounded-lg py-2">Cart</button>
            <RouterLink to="/wishlist" @click="mobileOpen = false" class="bg-white/10 rounded-lg py-2">Wishlist</RouterLink>
            <RouterLink to="/checkout" @click="mobileOpen = false" class="bg-white/10 rounded-lg py-2">Orders</RouterLink>
          </div>
        </aside>
      </div>
    </Transition>

    <CartDrawer :is-open="cartOpen" @close="cartOpen = false" />
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import CartDrawer from './CartDrawer.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()

const announcements = [
  '🚚 FREE SHIPPING ON ORDERS ABOVE ₹499',
  '🎉 USE CODE WELCOME10 FOR 10% OFF YOUR FIRST ORDER',
  '🔥 NEW DROPS EVERY WEEK — SHOP THE LATEST'
]

const categories = ['All', 'T-Shirts', 'Shirts', 'Joggers', 'Shorts', 'Hoodies', 'Jackets', 'Sneakers']
const mobileSections = [
  { title: 'Men', items: ['T-Shirts', 'Shirts', 'Joggers', 'Shorts', 'Hoodies', 'Jackets', 'Sneakers'] },
  { title: 'Women', items: ['T-Shirts', 'Shirts', 'Joggers', 'Shorts', 'Hoodies', 'Jackets'] },
  { title: 'Collections', items: ['T-Shirts', 'Shirts', 'Hoodies'] }
]

const showAnnouncement = ref(localStorage.getItem('hide_announcement') !== '1')
const currentAnnouncement = ref(0)
const scrolled = ref(false)
const activeMega = ref('')
const accountOpen = ref(false)
const cartOpen = ref(false)
const mobileOpen = ref(false)
const openAccordion = ref('')
const searchOpen = ref(false)
const search = ref('')
const searchResults = ref([])

const wishlistCount = computed(() => wishlistStore.items.length)

let announceTimer = null

function dismissAnnouncement() {
  showAnnouncement.value = false
  localStorage.setItem('hide_announcement', '1')
}

function onScroll() {
  scrolled.value = window.scrollY > 50
}

function goCategory(cat) {
  if (cat === 'All') {
    router.push('/products')
    return
  }
  router.push(`/products?category=${encodeURIComponent(cat)}`)
}

function toggleAccordion(section) {
  openAccordion.value = openAccordion.value === section ? '' : section
}

async function handleSearch() {
  if (!search.value.trim()) {
    searchResults.value = []
    return
  }
  const { data } = await api.get('/products', { params: { search: search.value, per_page: 6 } })
  searchResults.value = data.products || []
}

function quickSearch(term) {
  search.value = term
  handleSearch()
}

function openProduct(id) {
  searchOpen.value = false
  router.push(`/products/${id}`)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  if (showAnnouncement.value) {
    announceTimer = setInterval(() => {
      currentAnnouncement.value = (currentAnnouncement.value + 1) % announcements.length
    }, 3000)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (announceTimer) clearInterval(announceTimer)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.fade-up-enter-active,
.fade-up-leave-active { transition: all 0.2s ease; }
.fade-up-enter-from,
.fade-up-leave-to { opacity: 0; transform: translateY(-10px); }

.slide-left-enter-active,
.slide-left-leave-active { transition: opacity 0.25s ease; }
.slide-left-enter-from,
.slide-left-leave-to { opacity: 0; }
</style>
