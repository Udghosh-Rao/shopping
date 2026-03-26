<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-black mb-8">CHECKOUT</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Left: Checkout Form -->
        <div>
          <div class="bg-white rounded-lg shadow p-6 mb-6">
            <h2 class="font-bold text-xl mb-4">DELIVERY ADDRESS</h2>
            <form @submit.prevent="placeOrder" class="space-y-4">
              <input v-model="address.full_name" required type="text" placeholder="Full Name" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" />
              <input v-model="address.phone" required type="tel" placeholder="Phone Number" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" />
              <input v-model="address.line1" required type="text" placeholder="Address Line 1" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" />
              <input v-model="address.line2" type="text" placeholder="Address Line 2" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" />
              <div class="grid grid-cols-2 gap-4">
                <input v-model="address.city" required type="text" placeholder="City" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" />
                <input v-model="address.state" required type="text" placeholder="State" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" />
              </div>
              <input v-model="address.pincode" required type="text" placeholder="Pincode" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" />
            </form>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="font-bold text-xl mb-4">PAYMENT METHOD</h2>
            <div class="space-y-3">
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer" :class="paymentMethod === 'COD' ? 'border-[#ff6b00] bg-orange-50' : 'border-gray-200'">
                <input type="radio" v-model="paymentMethod" value="COD" class="mr-3" />
                <span class="font-medium">Cash on Delivery</span>
              </label>
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer" :class="paymentMethod === 'UPI' ? 'border-[#ff6b00] bg-orange-50' : 'border-gray-200'">
                <input type="radio" v-model="paymentMethod" value="UPI" class="mr-3" />
                <span class="font-medium">UPI</span>
              </label>
              <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer" :class="paymentMethod === 'Card' ? 'border-[#ff6b00] bg-orange-50' : 'border-gray-200'">
                <input type="radio" v-model="paymentMethod" value="Card" class="mr-3" />
                <span class="font-medium">Credit/Debit Card</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div>
          <div class="bg-white rounded-lg shadow p-6 sticky top-20">
            <h2 class="font-black text-xl mb-4">ORDER SUMMARY</h2>
            <div class="space-y-3 mb-6">
              <div v-for="(item, index) in cartStore.items" :key="index" class="flex justify-between text-sm">
                <span>{{ item.name }} ({{ item.quantity }}x)</span>
                <span>₹{{ item.price * item.quantity }}</span>
              </div>
            </div>
            <div class="border-t pt-4 space-y-3 mb-6">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="font-bold">₹{{ cartStore.totalPrice }}</span>
              </div>
              <div class="flex justify-between">
                <span>Delivery</span>
                <span class="font-bold">{{ cartStore.totalPrice >= 499 ? 'FREE' : '₹49' }}</span>
              </div>
              <div class="border-t pt-3 flex justify-between text-xl">
                <span class="font-black">TOTAL</span>
                <span class="font-black text-[#ff6b00]">₹{{ cartStore.totalPrice + (cartStore.totalPrice >= 499 ? 0 : 49) }}</span>
              </div>
            </div>
            <button @click="placeOrder" :disabled="placing" class="w-full py-4 bg-[#ff6b00] text-white rounded-lg font-bold hover:bg-[#ff8533] transition disabled:opacity-50">
              {{ placing ? 'PLACING ORDER...' : 'PLACE ORDER' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useToastStore } from '../stores/toastStore'
import api from '../services/api'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Toast from '../components/Toast.vue'

const router = useRouter()
const cartStore = useCartStore()
const toastStore = useToastStore()

const address = ref({
  full_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: ''
})
const paymentMethod = ref('COD')
const placing = ref(false)

const placeOrder = async () => {
  try {
    placing.value = true
    await api.post('/orders/checkout', {
      address: address.value,
      payment_method: paymentMethod.value
    })
    toastStore.success('🎉 Order placed successfully!')
    cartStore.clearCart()
    router.push('/order-success')
  } catch (error) {
    toastStore.error(error.response?.data?.error || 'Failed to place order')
  } finally {
    placing.value = false
  }
}
</script>
