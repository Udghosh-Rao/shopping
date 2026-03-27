<template>
  <div class="min-h-screen bg-[var(--black)] relative pt-24 pb-12 overflow-hidden">
    <!-- Animated Gradients -->
    <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen -translate-y-1/2 -translate-x-1/3"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <div class="mb-12 flex items-center justify-between">
        <div>
          <h1 class="text-5xl font-display font-black text-white tracking-widest uppercase mb-2">MY <span class="text-neon-purple drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">DROPS</span></h1>
          <p class="text-gray-400 font-bold tracking-widest text-sm uppercase">Track your acquired gear</p>
        </div>
        <router-link to="/profile" class="btn-glass hover:text-white flex items-center gap-2">
          <span>←</span> HQ
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="glass-card py-20 text-center flex flex-col items-center">
        <span class="text-6xl mb-6 anim-float block">📦</span>
        <h2 class="text-3xl font-display font-black text-white tracking-widest uppercase mb-4">NO DROPS DETECTED</h2>
        <p class="text-gray-400 font-bold tracking-widest text-sm uppercase mb-8">Your inventory is currently empty.</p>
        <router-link to="/products" class="btn-glow-purple">
          BROWSE GEAR →
        </router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6 stagger">
        <div v-for="(order, index) in orders" :key="order.id" class="glass-card overflow-hidden group reveal visible transition-all" :style="{ transitionDelay: `${index * 100}ms` }">
          <!-- Order Header -->
          <div class="bg-white/5 px-8 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <p class="text-[10px] font-bold text-gray-500 tracking-widest mb-1">ORDER ID</p>
              <p class="text-lg font-bold text-white tracking-wider">#{{ order.id }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-gray-500 tracking-widest mb-1">DATE SECURED</p>
              <p class="text-sm font-bold text-white tracking-wider">{{ formatDate(order.created_at) }}</p>
            </div>
            <div>
              <p class="text-[10px] font-bold text-gray-500 tracking-widest mb-1">TOTAL VALUE</p>
               <p class="text-xl font-black text-neon-orange font-display tracking-widest">₹{{ order.total }}</p>
            </div>
            <div>
              <span class="badge-neon px-4 py-2" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="px-8 py-6 bg-black/40">
            <div class="space-y-6">
              <div v-for="item in order.items" :key="item.id" class="flex gap-6 items-center">
                <div class="w-24 h-24 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group-hover:border-neon-purple/50 transition-colors flex-shrink-0">
                  <img v-if="item.product?.image_url" :src="item.product.image_url" class="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                  <div v-else class="w-full h-full flex items-center justify-center text-4xl">👕</div>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-white text-lg tracking-wider mb-2 uppercase">{{ item.product?.name || 'UNKNOWN GEAR' }}</h3>
                  <div class="flex items-center gap-4 text-xs font-bold text-gray-400 tracking-widest">
                    <span>QTY: {{ item.quantity }}</span>
                    <span v-if="item.size">SIZE: {{ item.size }}</span>
                    <span v-if="item.color">COLOR: {{ item.color }}</span>
                  </div>
                  <p class="text-sm font-black text-neon-orange mt-2 tracking-widest">₹{{ item.price * item.quantity }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useToast } from '../composables/useToast'

const { showToast } = useToast()
const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/orders')
    orders.value = response.data
  } catch (error) {
    showToast('Failed to connect to Order Database.', 'error')
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  }).toUpperCase()
}

const getStatusClass = (status) => {
  const stat = status?.toLowerCase()
  if (stat === 'pending') return 'badge-hot'
  if (stat === 'delivered') return 'badge-new'
  if (stat === 'shipped') return 'badge-limited'
  return 'badge-sale'
}
</script>
