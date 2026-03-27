<template>
  <header 
    class="fixed top-0 left-0 w-full z-40 transition-all duration-300"
    :class="{ 'glass': isScrolled, 'py-2': isScrolled, 'py-5': !isScrolled }"
  >
    <div class="container mx-auto px-6 flex items-center justify-between">
      
      <!-- Logo -->
      <RouterLink to="/" class="text-3xl font-display font-black tracking-widest text-white group">
        <span class="anim-gradient gradientShift inline-block group-hover:scale-105 transition-transform" 
              style="background-image: var(--grad-neon); -webkit-background-clip: text; color: transparent;">
          ASH<span class="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">KAIR</span>
        </span>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8">
        <RouterLink 
          to="/" 
          class="nav-link relative font-bold text-xs tracking-widest uppercase text-gray-300 hover:text-white transition-colors"
          active-class="active text-white"
        >
          Home
        </RouterLink>
        <RouterLink 
          to='/products' 
          class="nav-link relative font-bold text-xs tracking-widest uppercase text-gray-300 hover:text-white transition-colors"
          active-class="active text-white"
        >
          Shop
        </RouterLink>
        <RouterLink to="/products?badge=SALE" class="nav-link relative font-bold text-xs tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors">
          Sale 🔥
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button 
          @click="searchOpen = true"
          class="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-lg"
        >
          🔍
        </button>
        <RouterLink 
          to="/wishlist"
          class="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors relative text-lg"
        >
          🤍
          <span v-if="wishlistCount > 0"
            class="absolute -top-1 -right-1 bg-[#ff2d78] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {{ wishlistCount }}
          </span>
        </RouterLink>
        <button 
          @click="toggleCart(true)" 
          class="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors relative group text-lg"
        >
          🛒
          <span 
            v-if="cartCount > 0"
            class="absolute -top-1 -right-1 bg-neon-orange text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform"
            :class="{ 'anim-heartbeat': isAnimating }"
          >
            {{ cartCount }}
          </span>
        </button>
        <RouterLink to="/login" v-if="!authStore.isLoggedIn" class="hidden md:flex btn-glass hover:text-white !py-2 !px-6 text-xs items-center justify-center">
          SIGN IN
        </RouterLink>
        <RouterLink to="/profile" v-else class="hidden md:flex btn-glass hover:text-white !py-2 !px-6 text-xs items-center justify-center">
          MY ACCOUNT
        </RouterLink>
        <button 
          @click="mobileOpen = !mobileOpen"
          class="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div class="flex flex-col gap-1.5 w-4">
            <span class="block h-0.5 bg-white transition-all duration-300" :class="mobileOpen ? 'rotate-45 translate-y-2' : ''" />
            <span class="block h-0.5 bg-white transition-all duration-300" :class="mobileOpen ? 'opacity-0 scale-x-0' : ''" />
            <span class="block h-0.5 bg-white transition-all duration-300" :class="mobileOpen ? '-rotate-45 -translate-y-2' : ''" />
          </div>
        </button>
      </div>

    </div>

    <Transition name="slideDown">
      <div v-if="mobileOpen" class="md:hidden glass border-t border-white/10 px-6 py-6 flex flex-col gap-4">
        <RouterLink to="/" @click="mobileOpen = false"
          class="font-bold text-sm tracking-widest uppercase text-gray-300 hover:text-neon-orange transition-colors">Home</RouterLink>
        <RouterLink to="/products" @click="mobileOpen = false"
          class="font-bold text-sm tracking-widest uppercase text-gray-300 hover:text-neon-orange transition-colors">Shop</RouterLink>
        <RouterLink to="/wishlist" @click="mobileOpen = false"
          class="font-bold text-sm tracking-widest uppercase text-gray-300 hover:text-neon-orange transition-colors">Wishlist</RouterLink>
        <RouterLink to="/orders" @click="mobileOpen = false"
          class="font-bold text-sm tracking-widest uppercase text-gray-300 hover:text-neon-orange transition-colors">My Orders</RouterLink>
        <div class="border-t border-white/10 pt-4">
          <RouterLink v-if="!authStore.isLoggedIn" to="/login" @click="mobileOpen = false"
            class="btn-glow-orange w-full block text-center py-3 text-xs tracking-widest">SIGN IN</RouterLink>
          <RouterLink v-else to="/profile" @click="mobileOpen = false"
            class="btn-glass w-full block text-center py-3 text-xs tracking-widest">MY ACCOUNT</RouterLink>
        </div>
      </div>
    </Transition>

    <!-- Search Overlay -->
    <Transition name="fade">
      <div v-if="searchOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl" @click.self="closeSearch">
        <button @click="closeSearch" class="absolute top-8 right-8 text-6xl font-light text-white hover:text-[#ff6b00] transition-colors">×</button>
        <div class="w-full max-w-4xl px-6">
          <form @submit.prevent="doSearch">
            <input v-model="searchQuery" type="text" placeholder="SEARCH THE FUTURE..." 
              class="w-full bg-transparent border-b-2 border-white/20 text-5xl md:text-6xl font-display text-white placeholder:text-white/20 outline-none pb-4 focus:border-[#ff6b00] transition-colors"
              autofocus />
          </form>
          <div class="mt-8 flex flex-wrap gap-3 items-center">
            <span class="text-xs font-bold text-gray-500 tracking-widest">POPULAR //</span>
            <span v-for="tag in popularTags" :key="tag.label"
              @click="quickSearch(tag.query)"
              class="badge-neon px-3 py-1 cursor-pointer hover:scale-105 transition-transform"
              :class="tag.cls">{{ tag.label }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { toggleCart } from '../composables/useCart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const isScrolled = ref(false)
const searchOpen = ref(false)
const mobileOpen = ref(false)
const searchQuery = ref('')

const cartCount = computed(() => {
  return cartStore.totalItems
})
const wishlistCount = computed(() => wishlistStore.items.length)

const popularTags = [
  { label: 'SNEAKERS', query: 'Sneakers', cls: 'badge-hot' },
  { label: 'HOODIES', query: 'Hoodies', cls: 'badge-limited' },
  { label: 'T-SHIRTS', query: 'T-Shirts', cls: 'badge-new' },
  { label: 'JACKETS', query: 'Jackets', cls: 'badge-best' }
]

const isAnimating = ref(false)
watch(cartCount, (newVal, oldVal) => {
  if (newVal > oldVal) {
    isAnimating.value = true
    setTimeout(() => isAnimating.value = false, 1000)
  }
})

const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
}

const doSearch = () => {
  if (!searchQuery.value.trim()) return
  router.push({ path: '/products', query: { search: searchQuery.value.trim() } })
  closeSearch()
}

const quickSearch = (query) => {
  router.push({ path: '/products', query: { search: query } })
  closeSearch()
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--grad-orange);
  transition: width 0.3s var(--ease-smooth);
}
.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.slideDown-enter-active, .slideDown-leave-active { transition: all 0.3s var(--ease-smooth); }
.slideDown-enter-from, .slideDown-leave-to { opacity: 0; transform: translateY(-8px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
