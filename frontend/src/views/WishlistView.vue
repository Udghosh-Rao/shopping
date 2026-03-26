<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-black mb-8">MY WISHLIST</h1>

      <div v-if="wishlistStore.items.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🤍</div>
        <p class="text-xl text-gray-600 mb-6">Your wishlist is empty</p>
        <RouterLink to="/products" class="inline-block px-8 py-3 bg-[#ff6b00] text-white rounded-lg font-bold hover:bg-[#ff8533] transition">
          EXPLORE PRODUCTS
        </RouterLink>
      </div>

      <ProductGrid v-else :products="wishlistProducts" :loading="loading" />
    </div>

    <Footer />
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useWishlistStore } from '../stores/wishlistStore'
import api from '../services/api'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProductGrid from '../components/ProductGrid.vue'
import Toast from '../components/Toast.vue'

const wishlistStore = useWishlistStore()
const wishlistProducts = ref([])
const loading = ref(false)

const fetchWishlistProducts = async () => {
  loading.value = true
  try {
    const promises = wishlistStore.items.map(id => api.get(`/products/${id}`))
    const results = await Promise.all(promises)
    wishlistProducts.value = results.map(r => r.data)
  } catch (error) {
    console.error('Failed to fetch wishlist products:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWishlistProducts()
})
</script>
