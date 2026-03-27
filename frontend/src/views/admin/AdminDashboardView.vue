<template>
  <div class="min-h-screen bg-[var(--black)] pt-24 pb-12 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-10">
        <h1 class="text-4xl md:text-5xl font-display font-black text-white tracking-widest uppercase">
          ADMIN <span class="text-neon-orange">DASHBOARD</span>
        </h1>
        <router-link to="/profile" class="btn-glass">Back to Profile</router-link>
      </div>

      <div v-if="loading" class="glass-card p-10 text-center text-white">Loading dashboard...</div>

      <div v-else class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="glass-card p-6"><p class="text-xs text-gray-400 uppercase tracking-widest">Today Revenue</p><p class="text-2xl text-neon-orange font-black mt-2">₹{{ stats.revenue.today.toFixed(2) }}</p></div>
          <div class="glass-card p-6"><p class="text-xs text-gray-400 uppercase tracking-widest">Week Revenue</p><p class="text-2xl text-neon-cyan font-black mt-2">₹{{ stats.revenue.this_week.toFixed(2) }}</p></div>
          <div class="glass-card p-6"><p class="text-xs text-gray-400 uppercase tracking-widest">Month Revenue</p><p class="text-2xl text-neon-purple font-black mt-2">₹{{ stats.revenue.this_month.toFixed(2) }}</p></div>
          <div class="glass-card p-6"><p class="text-xs text-gray-400 uppercase tracking-widest">Total Users</p><p class="text-2xl text-white font-black mt-2">{{ stats.users.total }}</p></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <router-link to="/admin/products" class="glass-card p-6 text-white hover:border-neon-orange/40 transition-colors">Manage Products</router-link>
          <router-link to="/admin/orders" class="glass-card p-6 text-white hover:border-neon-purple/40 transition-colors">Manage Orders</router-link>
          <router-link to="/admin/users" class="glass-card p-6 text-white hover:border-neon-cyan/40 transition-colors">Manage Users</router-link>
        </div>

        <div class="glass-card p-6">
          <h2 class="text-xl font-bold text-white mb-4">Order Status</h2>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div class="bg-white/5 p-3 rounded text-center"><p class="text-gray-400">Pending</p><p class="text-white font-bold mt-1">{{ stats.orders.pending }}</p></div>
            <div class="bg-white/5 p-3 rounded text-center"><p class="text-gray-400">Confirmed</p><p class="text-white font-bold mt-1">{{ stats.orders.confirmed }}</p></div>
            <div class="bg-white/5 p-3 rounded text-center"><p class="text-gray-400">Shipped</p><p class="text-white font-bold mt-1">{{ stats.orders.shipped }}</p></div>
            <div class="bg-white/5 p-3 rounded text-center"><p class="text-gray-400">Delivered</p><p class="text-white font-bold mt-1">{{ stats.orders.delivered }}</p></div>
            <div class="bg-white/5 p-3 rounded text-center"><p class="text-gray-400">Cancelled</p><p class="text-white font-bold mt-1">{{ stats.orders.cancelled }}</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../../services/api'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()
const loading = ref(true)
const stats = ref({
  revenue: { today: 0, this_week: 0, this_month: 0, total: 0 },
  orders: { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 },
  users: { total: 0, new_this_month: 0 },
  top_products: []
})

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/dashboard/stats')
    stats.value = data
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to load admin dashboard', 'error')
  } finally {
    loading.value = false
  }
})
</script>
