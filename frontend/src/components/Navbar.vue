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
        <a href="#" class="nav-link relative font-bold text-xs tracking-widest uppercase text-gray-300 hover:text-white transition-colors">
          Categories
        </a>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <button 
          @click="toggleSearch" 
          class="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-xl"
        >
          🔍
        </button>
        <button 
          @click="$router.push('/cart')" 
          class="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors relative group text-xl"
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
      </div>

    </div>

    <!-- Search Overlay -->
    <Transition name="fade">
      <div v-if="searchOpen" class="fixed inset-0 z-50 glass-card !rounded-none !border-0 flex items-center justify-center bg-black/80 backdrop-blur-xl">
        <button @click="toggleSearch" class="absolute top-8 right-8 text-6xl font-light text-white hover:text-neon-orange transition-colors">×</button>
        <div class="w-full max-w-4xl px-6">
          <input 
            type="text" 
            placeholder="SEARCH THE FUTURE..." 
            class="w-full bg-transparent border-b-2 border-white/20 text-6xl font-display text-white placeholder:text-white/20 outline-none pb-4 focus:border-neon-orange transition-colors"
            autofocus
          >
          <div class="mt-8 flex gap-4">
            <span class="text-xs font-bold text-gray-500 tracking-widest">POPULAR //</span>
            <div class="flex gap-3">
              <span class="badge-neon badge-hot px-3 py-1 cursor-pointer">SNEAKERS</span>
              <span class="badge-neon badge-limited px-3 py-1 cursor-pointer">MARVEL HOODIES</span>
              <span class="badge-neon badge-new px-3 py-1 cursor-pointer">ANIME MERCH</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'

const authStore = useAuthStore()
const cartStore = useCartStore()
const isScrolled = ref(false)
const searchOpen = ref(false)

const cartCount = computed(() => {
  return cartStore.totalItems
})

const isAnimating = ref(false)
watch(cartCount, (newVal, oldVal) => {
  if (newVal > oldVal) {
    isAnimating.value = true
    setTimeout(() => isAnimating.value = false, 1000)
  }
})

const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
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

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
