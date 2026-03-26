<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

const open = ref(false)
const cartStore = useCartStore()
const authStore = useAuthStore()
</script>

<template>
  <header class="bg-white shadow">
    <nav class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <RouterLink to="/" class="text-2xl font-bold text-primary">ShopVue</RouterLink>

      <button class="md:hidden text-slate-700" @click="open = !open">☰</button>

      <div :class="['md:flex items-center gap-6', open ? 'block' : 'hidden md:flex']">
        <RouterLink to="/" class="block py-1 hover:text-primary">Home</RouterLink>
        <RouterLink to="/" class="block py-1 hover:text-primary">Products</RouterLink>
        <RouterLink to="/cart" class="block py-1 hover:text-primary">Cart</RouterLink>
        <RouterLink v-if="!authStore.isAuthenticated" to="/login" class="block py-1 hover:text-primary">Login</RouterLink>
        <RouterLink v-if="authStore.user?.role === 'admin'" to="/admin" class="block py-1 hover:text-primary">Admin</RouterLink>
        <button
          v-if="authStore.isAuthenticated"
          class="bg-slate-900 text-white px-3 py-1 rounded-lg shadow hover:bg-slate-800 transition"
          @click="authStore.logout"
        >
          Logout
        </button>
      </div>

      <RouterLink to="/cart" class="relative ml-4 text-slate-700">
        <span>🛒</span>
        <span class="absolute -top-2 -right-3 bg-accent text-white text-xs rounded-full px-2">
          {{ cartStore.totalItems }}
        </span>
      </RouterLink>
    </nav>
  </header>
</template>
