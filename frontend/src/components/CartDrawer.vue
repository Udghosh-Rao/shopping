<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99]" @click="$emit('close')"></div>
  </Transition>

  <Transition name="slide-right">
    <aside v-if="isOpen" class="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[100] flex flex-col">
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl" style="font-family: var(--font-display)">MY CART</h2>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600 font-bold">{{ cartStore.totalItems }}</span>
            <button class="w-9 h-9 rounded-full hover:bg-gray-100" @click="$emit('close')">✕</button>
          </div>
        </div>

        <div class="mt-3">
          <p class="text-xs text-gray-600">
            <span v-if="cartStore.totalPrice < 499">Add ₹{{ 499 - cartStore.totalPrice }} more for FREE SHIPPING!</span>
            <span v-else>🎉 You've unlocked FREE SHIPPING!</span>
          </p>
          <div class="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div class="h-full bg-orange-500 transition-all duration-300" :style="{ width: `${Math.min((cartStore.totalPrice / 499) * 100, 100)}%` }"></div>
          </div>
        </div>
      </div>

      <div v-if="cartStore.items.length" class="flex-1 overflow-y-auto p-4 space-y-3">
        <TransitionGroup name="item">
          <div v-for="(item, idx) in cartStore.items" :key="`${item.id}-${item.size}-${item.color}-${idx}`" class="flex gap-3 border rounded-xl p-3">
            <img :src="item.image" :alt="item.name" class="w-20 h-24 rounded-xl object-cover" />
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm line-clamp-2">{{ item.name }}</p>
              <div class="mt-1 flex gap-1.5 text-[10px]">
                <span class="px-2 py-0.5 rounded-full bg-gray-100">{{ item.size }}</span>
                <span class="px-2 py-0.5 rounded-full bg-gray-100">{{ item.color }}</span>
              </div>
              <p class="mt-2 text-orange-500 font-bold">₹{{ item.price }}</p>
              <div class="mt-2 flex items-center gap-2">
                <button class="w-7 h-7 rounded-full border" @click="decrement(item)">−</button>
                <span class="text-sm w-5 text-center">{{ item.quantity }}</span>
                <button class="w-7 h-7 rounded-full border" @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity + 1)">+</button>
                <button class="ml-auto text-gray-400 hover:text-red-500" @click="cartStore.removeItem(item.id, item.size, item.color)">×</button>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <div v-else class="flex-1 grid place-items-center p-6 text-center">
        <div>
          <p class="text-6xl">🛍️</p>
          <p class="mt-4 text-xl font-bold">Your cart is empty</p>
          <p class="text-gray-500 text-sm mt-1">Looks like you haven't added anything yet</p>
          <button class="btn-primary mt-5" @click="$emit('close')">CONTINUE SHOPPING →</button>
        </div>
      </div>

      <div v-if="cartStore.items.length" class="border-t p-4 space-y-3 sticky bottom-0 bg-white">
        <div v-if="!couponApplied" class="flex gap-2">
          <input v-model="couponCode" class="input-field !py-2" placeholder="Coupon code" />
          <button class="btn-dark !px-4 !py-2" @click="applyCoupon">APPLY</button>
        </div>
        <div v-else class="flex items-center justify-between bg-green-50 text-green-600 rounded-lg px-3 py-2 text-sm font-semibold">
          <span>Coupon {{ couponCode.toUpperCase() }} applied</span>
          <button @click="removeCoupon">✕</button>
        </div>

        <div class="space-y-1 text-sm">
          <div class="flex justify-between"><span>Subtotal</span><span>₹{{ subtotal }}</span></div>
          <div class="flex justify-between"><span>Discount</span><span class="text-green-600">-₹{{ discount }}</span></div>
          <div class="flex justify-between"><span>Delivery</span><span>{{ deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}` }}</span></div>
        </div>

        <div class="border-t pt-2 flex justify-between text-lg font-black">
          <span>TOTAL</span>
          <span>₹{{ total }}</span>
        </div>

        <button class="btn-primary w-full justify-center" @click="checkout">CHECKOUT →</button>
        <p class="text-xs text-gray-500 text-center">🔒 Secure Checkout</p>
      </div>
    </aside>
  </Transition>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'

defineProps({
  isOpen: { type: Boolean, required: true }
})

defineEmits(['close'])

const cartStore = useCartStore()
const router = useRouter()
const couponCode = ref('')
const couponApplied = ref(false)

const subtotal = computed(() => cartStore.totalPrice)
const discount = computed(() => (couponApplied.value ? Math.round(subtotal.value * 0.1) : 0))
const deliveryCharge = computed(() => (subtotal.value - discount.value >= 499 ? 0 : 49))
const total = computed(() => subtotal.value - discount.value + deliveryCharge.value)

function decrement(item) {
  if (item.quantity <= 1) {
    cartStore.removeItem(item.id, item.size, item.color)
    return
  }
  cartStore.updateQuantity(item.id, item.size, item.color, item.quantity - 1)
}

function applyCoupon() {
  if (!couponCode.value.trim()) return
  couponApplied.value = true
}

function removeCoupon() {
  couponApplied.value = false
  couponCode.value = ''
}

function checkout() {
  router.push('/checkout')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.slide-right-enter-active,
.slide-right-leave-active { transition: transform 0.3s ease; }
.slide-right-enter-from,
.slide-right-leave-to { transform: translateX(100%); }

.item-enter-active,
.item-leave-active { transition: all 0.25s ease; }
.item-enter-from { opacity: 0; transform: translateX(20px); }
.item-leave-to { opacity: 0; transform: translateX(20px); }
</style>
