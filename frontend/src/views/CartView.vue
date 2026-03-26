<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-black mb-8">SHOPPING CART</h1>

      <div v-if="cartStore.isEmpty" class="text-center py-16">
        <div class="text-6xl mb-4">🛒</div>
        <p class="text-xl text-gray-600 mb-6">Your cart is empty</p>
        <RouterLink to="/products" class="inline-block px-8 py-3 bg-[#ff6b00] text-white rounded-lg font-bold hover:bg-[#ff8533] transition">
          CONTINUE SHOPPING
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="(item, index) in cartStore.items" :key="index" class="bg-white rounded-lg shadow p-4 flex gap-4">
            <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded" />
            <div class="flex-1">
              <h3 class="font-bold mb-1">{{ item.name }}</h3>
              <p class="text-sm text-gray-500 mb-2">Size: {{ item.size }} | Color: {{ item.color }}</p>
              <p class="font-bold text-lg">₹{{ item.price }}</p>
              <div class="flex items-center gap-3 mt-3">
                <button @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity - 1)" class="w-8 h-8 border rounded hover:bg-gray-100">-</button>
                <span class="font-bold">{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity + 1)" class="w-8 h-8 border rounded hover:bg-gray-100">+</button>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-xl mb-3">₹{{ item.price * item.quantity }}</p>
              <button @click="cartStore.removeItem(item.id, item.size, item.color)" class="text-red-500 hover:underline text-sm">Remove</button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-20">
            <h2 class="font-black text-xl mb-4">ORDER SUMMARY</h2>
            <div class="space-y-3 mb-4">
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
                <span class="font-black">₹{{ cartStore.totalPrice + (cartStore.totalPrice >= 499 ? 0 : 49) }}</span>
              </div>
            </div>
            <RouterLink to="/checkout" class="block w-full py-3 bg-[#ff6b00] text-white rounded-lg font-bold text-center hover:bg-[#ff8533] transition">
              PROCEED TO CHECKOUT
            </RouterLink>
            <button @click="cartStore.clearCart()" class="w-full mt-3 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition">
              CLEAR CART
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
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Toast from '../components/Toast.vue'

const cartStore = useCartStore()
</script>
