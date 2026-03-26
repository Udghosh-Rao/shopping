<template>
  <header class="sticky top-0 bg-[#0d0d0d] text-white shadow-lg z-30">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="text-2xl md:text-3xl font-black text-[#ff6b00]">SHOPZONE</span>
          <span class="hidden md:block text-xs text-gray-400">Pop Culture Store</span>
        </RouterLink>

        <!-- Desktop Nav Links -->
        <div class="hidden lg:flex items-center gap-6 text-sm font-medium uppercase">
          <RouterLink to="/products?category=T-Shirts" class="hover:text-[#ff6b00] transition">
            T-Shirts
          </RouterLink>
          <RouterLink to="/products?category=Shirts" class="hover:text-[#ff6b00] transition">
            Shirts
          </RouterLink>
          <RouterLink to="/products?category=Sneakers" class="hover:text-[#ff6b00] transition">
            Sneakers
          </RouterLink>
          <RouterLink to="/products?category=Joggers" class="hover:text-[#ff6b00] transition">
            Joggers
          </RouterLink>
          <RouterLink to="/products?category=Accessories" class="hover:text-[#ff6b00] transition">
            Accessories
          </RouterLink>
          <RouterLink to="/products?badge=NEW" class="text-[#ff6b00] hover:text-[#ff8533] transition">
            NEW DROPS
          </RouterLink>
        </div>

        <!-- Right Icons -->
        <div class="flex items-center gap-4">
          <!-- Search Icon -->
          <button @click="toggleSearch" class="hover:text-[#ff6b00] transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          <!-- Wishlist Icon -->
          <RouterLink to="/wishlist" class="hover:text-[#ff6b00] transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </RouterLink>

          <!-- Cart Icon with Badge -->
          <button @click="toggleCart" class="relative hover:text-[#ff6b00] transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 bg-[#ff6b00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartStore.totalItems }}
            </span>
          </button>

          <!-- Login/User -->
          <RouterLink v-if="!authStore.isLoggedIn" to="/login" class="hidden md:block px-4 py-2 bg-[#ff6b00] rounded-lg font-bold hover:bg-[#ff8533] transition">
            LOGIN
          </RouterLink>
          <div v-else class="relative hidden md:block">
            <button @click="showUserMenu = !showUserMenu" class="flex items-center gap-2 hover:text-[#ff6b00] transition">
              <span>👤</span>
              <span class="text-sm">{{ authStore.username }}</span>
            </button>
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2">
              <RouterLink to="/orders" class="block px-4 py-2 hover:bg-gray-100">My Orders</RouterLink>
              <RouterLink to="/wishlist" class="block px-4 py-2 hover:bg-gray-100">Wishlist</RouterLink>
              <button @click="authStore.logout()" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button @click="showMobileMenu = !showMobileMenu" class="lg:hidden hover:text-[#ff6b00] transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Search Bar (Expandable) -->
      <Transition name="slide-down">
        <div v-if="showSearch" class="mt-4">
          <SearchBar @search="handleSearch" />
        </div>
      </Transition>
    </nav>

    <!-- Mobile Menu Sidebar -->
    <Transition name="slide-left">
      <div v-if="showMobileMenu" class="fixed inset-0 bg-black/50 z-50" @click="showMobileMenu = false">
        <div @click.stop class="absolute right-0 top-0 h-full w-64 bg-[#0d0d0d] shadow-xl p-6 overflow-y-auto">
          <button @click="showMobileMenu = false" class="absolute top-4 right-4 text-2xl">✕</button>
          <div class="mt-8 space-y-4">
            <RouterLink to="/products?category=T-Shirts" class="block py-2 hover:text-[#ff6b00] transition" @click="showMobileMenu = false">T-Shirts</RouterLink>
            <RouterLink to="/products?category=Shirts" class="block py-2 hover:text-[#ff6b00] transition" @click="showMobileMenu = false">Shirts</RouterLink>
            <RouterLink to="/products?category=Sneakers" class="block py-2 hover:text-[#ff6b00] transition" @click="showMobileMenu = false">Sneakers</RouterLink>
            <RouterLink to="/products?category=Joggers" class="block py-2 hover:text-[#ff6b00] transition" @click="showMobileMenu = false">Joggers</RouterLink>
            <RouterLink to="/products?category=Accessories" class="block py-2 hover:text-[#ff6b00] transition" @click="showMobileMenu = false">Accessories</RouterLink>
            <RouterLink to="/products?badge=NEW" class="block py-2 text-[#ff6b00] transition" @click="showMobileMenu = false">NEW DROPS</RouterLink>
            <div class="border-t border-gray-700 my-4"></div>
            <RouterLink v-if="!authStore.isLoggedIn" to="/login" class="block py-2 hover:text-[#ff6b00] transition" @click="showMobileMenu = false">Login</RouterLink>
            <RouterLink v-if="!authStore.isLoggedIn" to="/register" class="block py-2 hover:text-[#ff6b00] transition" @click="showMobileMenu = false">Register</RouterLink>
            <button v-if="authStore.isLoggedIn" @click="authStore.logout(); showMobileMenu = false" class="block py-2 text-red-500 hover:text-red-400 transition">Logout</button>
          </div>
        </div>
      </div>
    </Transition>
  </header>

  <!-- Cart Drawer -->
  <CartDrawer :isOpen="showCart" @close="showCart = false" />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import CartDrawer from './CartDrawer.vue'
import SearchBar from './SearchBar.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const showSearch = ref(false)
const showCart = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const toggleSearch = () => {
  showSearch.value = !showSearch.value
}

const toggleCart = () => {
  showCart.value = !showCart.value
}

const handleSearch = (query) => {
  if (query) {
    router.push(`/products?search=${query}`)
    showSearch.value = false
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
}
</style>
