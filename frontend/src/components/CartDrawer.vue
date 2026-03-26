<template>
  <!-- Backdrop -->
  <Transition name="backdrop">
    <div
      v-if="isOpen"
      @click="close"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
    ></div>
  </Transition>

  <!-- Drawer -->
  <Transition name="drawer">
    <div
      v-if="isOpen"
      class="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b">
        <h2 class="text-xl font-bold">Shopping Cart ({{ cartStore.totalItems }})</h2>
        <button
          @click="close"
          class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition"
        >
          ✕
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="cartStore.isEmpty" class="text-center py-16">
          <p class="text-gray-500 mb-4">Your cart is empty</p>
          <button
            @click="close"
            class="text-[#ff6b00] font-bold hover:underline"
          >
            Continue Shopping
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(item, index) in cartStore.items"
            :key="index"
            class="flex gap-3 p-3 border rounded-lg"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-20 h-20 object-cover rounded"
            />
            <div class="flex-1">
              <h3 class="font-medium text-sm">{{ item.name }}</h3>
              <p class="text-xs text-gray-500">Size: {{ item.size }} | Color: {{ item.color }}</p>
              <p class="text-sm font-bold mt-1">₹{{ item.price }}</p>
              <div class="flex items-center gap-2 mt-2">
                <button
                  @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity - 1)"
                  class="w-6 h-6 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span class="text-sm">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity + 1)"
                  class="w-6 h-6 border rounded hover:bg-gray-100"
                >
                  +
                </button>
                <button
                  @click="cartStore.removeItem(item.id, item.size, item.color)"
                  class="ml-auto text-red-500 text-xs hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="!cartStore.isEmpty" class="border-t p-4 space-y-3">
        <div class="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{{ cartStore.totalPrice }}</span>
        </div>
        <button
          @click="goToCheckout"
          class="w-full bg-[#ff6b00] text-white py-3 rounded-lg font-bold hover:bg-[#ff8533] transition"
        >
          PROCEED TO CHECKOUT
        </button>
        <button
          @click="close"
          class="w-full border-2 border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
const cartStore = useCartStore()
const router = useRouter()

const close = () => {
  emit('close')
}

const goToCheckout = () => {
  close()
  router.push('/checkout')
}
</script>

<style scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
