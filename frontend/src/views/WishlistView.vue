<template>
  <div class="min-h-screen bg-[var(--black)] relative pt-24 pb-12 overflow-hidden">
    <!-- Animated Gradients -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-pink/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen -translate-y-1/2 translate-x-1/3"></div>

    <div class="container mx-auto px-6 max-w-7xl relative z-10">
      <h1 class="text-5xl font-display font-black text-white tracking-widest uppercase mb-12">RADAR <span class="text-neon-pink drop-shadow-[0_0_10px_rgba(255,45,120,0.5)]">LOCKS</span></h1>

      <div v-if="wishlistStore.items.length === 0" class="glass-card text-center py-24 flex flex-col items-center">
        <span class="text-7xl mb-8 anim-float block text-white opacity-50">◎</span>
        <h2 class="text-3xl font-display font-black text-white tracking-widest uppercase mb-4">NO TARGETS LOCKED</h2>
        <p class="text-xl font-bold text-gray-400 tracking-widest mb-10">Scan the catalog for heat.</p>
        <RouterLink to="/products" class="btn-glow-pink">
          SCAN RADAR →
        </RouterLink>
      </div>

      <div v-else>
        <p class="text-gray-400 font-bold tracking-widest text-sm uppercase mb-8 border-b border-white/10 pb-4 inline-block">{{ wishlistStore.items.length }} TARGET{{ wishlistStore.items.length > 1 ? 'S' : '' }} LOCKED</p>
        <ProductGrid :products="wishlistProducts" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useWishlistStore } from '../stores/wishlistStore'
import api from '../services/api'
import ProductGrid from '../components/ProductGrid.vue'

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
