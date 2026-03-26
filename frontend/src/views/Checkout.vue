<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import api from '../services/api'

const router = useRouter()
const cartStore = useCartStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  fullName: '',
  address: '',
  city: '',
  postalCode: ''
})

async function placeOrder() {
  error.value = ''
  loading.value = true
  try {
    await api.post('/orders/checkout', { shipping_address: form })
    await cartStore.clearCart()
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Checkout failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="grid lg:grid-cols-2 gap-6">
    <div class="bg-white rounded-2xl p-6 shadow-md">
      <h1 class="text-2xl font-bold mb-4">Checkout</h1>
      <form class="space-y-3" @submit.prevent="placeOrder">
        <input v-model="form.fullName" placeholder="Full Name" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        <input v-model="form.address" placeholder="Address" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        <input v-model="form.city" placeholder="City" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        <input v-model="form.postalCode" placeholder="Postal Code" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        <button class="w-full bg-primary text-white rounded-lg px-4 py-3 shadow hover:bg-indigo-700 transition" :disabled="loading">
          {{ loading ? 'Placing Order...' : 'Place Order' }}
        </button>
      </form>
    </div>

    <div class="bg-white rounded-2xl p-6 shadow-md h-fit">
      <h2 class="text-xl font-bold mb-4">Order Summary</h2>
      <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between py-2 border-b text-sm">
        <span>{{ item.product?.name }} × {{ item.quantity }}</span>
        <span>${{ (item.product?.price * item.quantity).toFixed(2) }}</span>
      </div>
      <p class="mt-4 font-semibold text-lg">Total: ${{ cartStore.totalPrice.toFixed(2) }}</p>
    </div>
  </section>
</template>
