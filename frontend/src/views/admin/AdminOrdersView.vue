<template>
  <div class="min-h-screen bg-[var(--black)] pt-24 pb-12 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 class="text-4xl font-display font-black text-white tracking-widest uppercase">ADMIN ORDERS</h1>
        <router-link to="/admin" class="btn-glass">Dashboard</router-link>
      </div>

      <div class="glass-card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/10 text-left text-gray-400">
              <th class="p-4">Order</th><th class="p-4">Total</th><th class="p-4">Status</th><th class="p-4">Date</th><th class="p-4">Update</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b border-white/5 text-white">
              <td class="p-4">#{{ order.id }}</td>
              <td class="p-4">₹{{ order.total }}</td>
              <td class="p-4 uppercase">{{ order.status }}</td>
              <td class="p-4">{{ formatDate(order.created_at) }}</td>
              <td class="p-4">
                <select class="bg-black border border-white/20 px-2 py-1" :value="order.status" @change="updateStatus(order.id, $event.target.value)">
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../../services/api'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()
const orders = ref([])

const loadOrders = async () => {
  const { data } = await api.get('/admin/orders', { params: { per_page: 100 } })
  orders.value = data.orders || []
}

const updateStatus = async (id, status) => {
  try {
    await api.put(`/admin/orders/${id}`, { status })
    showToast('Order status updated', 'success')
    await loadOrders()
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to update status', 'error')
  }
}

const formatDate = (dateString) => new Date(dateString).toLocaleString()

onMounted(async () => {
  try {
    await loadOrders()
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to load orders', 'error')
  }
})
</script>
