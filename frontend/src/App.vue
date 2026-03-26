<script setup>
import { onMounted, ref } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CartDrawer from './components/CartDrawer.vue'
import { useAuthStore } from './stores/authStore'
import { useCartStore } from './stores/cartStore'

const authStore = useAuthStore()
const cartStore = useCartStore()
const drawerOpen = ref(false)

onMounted(async () => {
  if (authStore.token) {
    try {
      await authStore.fetchUser()
      await cartStore.syncWithBackend()
    } catch {
      authStore.logout()
    }
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
      <RouterView />
    </main>
    <Footer />
    <CartDrawer :open="drawerOpen" @close="drawerOpen = false" />
  </div>
</template>
