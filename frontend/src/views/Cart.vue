<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()

const subtotal = computed(() => cartStore.totalPrice)
const total = computed(() => subtotal.value)

onMounted(async () => {
  await cartStore.syncWithBackend()
})
</script>

<template>
  <section class="grid lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
      <h1 class="text-2xl font-bold mb-4">Your Cart</h1>
      <div v-if="!cartStore.items.length" class="text-slate-600">Your cart is empty.</div>
      <div v-for="item in cartStore.items" :key="item.id" class="py-4 border-b flex gap-4 items-center">
        <img :src="item.product?.image_url" class="w-20 h-20 rounded-lg object-cover" />
        <div class="flex-1">
          <p class="font-medium">{{ item.product?.name }}</p>
          <p class="text-primary font-semibold">${{ item.product?.price?.toFixed(2) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-2 py-1 border rounded" @click="cartStore.updateQuantity(item.id, item.quantity - 1)">-</button>
          <span>{{ item.quantity }}</span>
          <button class="px-2 py-1 border rounded" @click="cartStore.updateQuantity(item.id, item.quantity + 1)">+</button>
        </div>
        <button class="text-red-600" @click="cartStore.removeItem(item.id)">Remove</button>
      </div>
    </div>

    <aside class="bg-white rounded-2xl p-6 shadow-md h-fit">
      <h2 class="text-xl font-bold mb-4">Summary</h2>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between"><span>Subtotal</span><span>${{ subtotal.toFixed(2) }}</span></div>
        <div class="flex justify-between font-semibold text-lg"><span>Total</span><span>${{ total.toFixed(2) }}</span></div>
      </div>
      <button
        class="mt-6 w-full bg-primary text-white px-4 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
        @click="router.push('/checkout')"
      >
        Proceed to Checkout
      </button>
    </aside>
  </section>
</template>
