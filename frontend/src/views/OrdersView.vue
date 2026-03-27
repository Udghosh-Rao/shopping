<template>
  <div class="min-h-screen bg-white py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Orders</h1>
        <p class="mt-2 text-gray-600">Track and manage your orders</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center py-20">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
        <p class="text-gray-600 mb-6">Start shopping to see your orders here</p>
        <router-link to="/products" class="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
          Browse Products
        </router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <!-- Order Header -->
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="text-sm text-gray-600">Order ID</p>
                <p class="text-lg font-semibold text-gray-900">#{{ order.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Order Date</p>
                <p class="text-lg font-medium text-gray-900">{{ formatDate(order.created_at) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Total Amount</p>
                <p class="text-lg font-bold text-orange-600">₹{{ order.total_amount.toLocaleString() }}</p>
              </div>
              <div>
                <span 
                  class="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                  :class="getStatusClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="px-6 py-4">
            <div class="space-y-4">
              <div v-for="item in order.items" :key="item.id" class="flex gap-4 items-start">
                <div class="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  <img 
                    v-if="item.product?.image_url" 
                    :src="item.product.image_url" 
                    :alt="item.product.name"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ item.product?.name || 'Product' }}</h3>
                  <p class="text-sm text-gray-600 mt-1">
                    Quantity: {{ item.quantity }} 
                    <span v-if="item.size"> | Size: {{ item.size }}</span>
                    <span v-if="item.color"> | Color: {{ item.color }}</span>
                  </p>
                  <p class="text-sm font-semibold text-orange-600 mt-2">₹{{ (item.price * item.quantity).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div class="flex justify-between items-center">
              <div v-if="order.delivery_address" class="text-sm text-gray-600">
                <p class="font-semibold text-gray-900">Delivery Address:</p>
                <p>{{ order.delivery_address }}</p>
              </div>
              <router-link 
                :to="`/order/${order.id}`" 
                class="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center"
              >
                View Details
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </router-link>
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
import { useToastStore } from '../stores/toastStore'

const { showToast } = useToastStore()
const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await api.get('/orders')
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    showToast(error.response?.data?.error || 'Failed to load orders', 'error')
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return statusClasses[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}
</script>
