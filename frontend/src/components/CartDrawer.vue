<template>
  <div>
    <!-- Backdrop overlay -->
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        @click="closeCart"
      ></div>
    </Transition>

    <!-- Drawer Panel -->
    <Transition name="drawer">
      <div 
        v-if="isOpen" 
        class="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--dark-2)] z-50 flex flex-col shadow-2xl border-l border-white/10"
      >
        <!-- Header -->
        <div class="glass-card !rounded-none p-6 border-b border-white/10 flex justify-between items-center">
          <h2 class="text-2xl font-display text-white tracking-widest">YOUR CART</h2>
          <button @click="closeCart" class="text-white hover:text-orange-500 transition-colors">
            ✕
          </button>
        </div>

        <!-- Free Shipping Target -->
        <div class="px-6 py-4 border-b border-white/5 bg-white/5">
          <div class="flex justify-between text-xs mb-2 font-bold uppercase tracking-wider text-gray-400">
            <span v-if="progress < 100">Add ${{ remainder }} for Free Shipping</span>
            <span v-else class="text-neon-green anim-heartbeat inline-block">🎉 Free Shipping Unlocked!</span>
          </div>
          <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
            <div 
              class="h-full rounded-full transition-all duration-500"
              :class="progress >= 100 ? 'bg-neon-green anim-glow' : 'bg-[var(--grad-orange)]'"
              :style="{ width: progress + '%', transitionTimingFunction: 'var(--ease-bounce)' }"
            ></div>
          </div>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          <TransitionGroup name="list">
            <div 
              v-for="item in cart" 
              :key="item.id"
              class="flex gap-4 p-4 glass-card relative group"
            >
              <img :src="item.image" class="w-20 h-24 object-cover rounded-xl" />
              <div class="flex flex-col justify-between flex-1">
                <div class="pr-6">
                  <h3 class="font-bold text-white leading-tight line-clamp-2">{{ item.name }}</h3>
                  <p class="text-sm text-gray-400 mt-1 uppercase tracking-wider">{{ item.size }}</p>
                </div>
                <!-- Price & Quantity -->
                <div class="flex justify-between items-center mt-3">
                  <div class="flip-price text-neon-orange font-bold text-lg">
                    ${{ item.price * item.quantity }}
                  </div>
                  <div class="flex items-center gap-2 bg-white/10 rounded-full px-2 py-1">
                    <button @click="updateEq(item, -1)" class="w-6 h-6 rounded-full hover:bg-white/20 transition-transform hover:scale-110 flex items-center justify-center">-</button>
                    <span class="text-sm w-6 text-center font-bold relative flip-container flex items-center justify-center">
                      <Transition name="flip" mode="out-in">
                        <span :key="item.quantity" class="inline-block">{{ item.quantity }}</span>
                      </Transition>
                    </span>
                    <button @click="updateEq(item, 1)" class="w-6 h-6 rounded-full hover:bg-white/20 transition-transform hover:scale-110 flex items-center justify-center">+</button>
                  </div>
                </div>
              </div>
              <button @click="removeItem(item)" class="absolute top-4 right-4 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all font-bold">✕</button>
            </div>
          </TransitionGroup>

          <div v-if="cart.length === 0" class="flex-1 flex flex-col items-center justify-center text-center opacity-50 h-full py-10">
            <span class="text-6xl mb-4 anim-float block">🛒</span>
            <p class="text-xl font-bold font-display tracking-widest text-white">YOUR CART IS EMPTY</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t border-white/10 bg-black/40">
          <div class="flex justify-between mb-4 text-xl font-display tracking-widest px-2">
            <span class="text-gray-400">TOTAL</span>
            <span class="text-white">${{ total }}</span>
          </div>
          <button class="w-full btn-glow-orange anim-gradient anim-glow py-4 text-lg tracking-widest relative">
            SECURE CHECKOUT
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { cartState, toggleCart, removeFromCart, updateQuantity, cartTotal } from '../composables/useCart'

const isOpen = computed(() => cartState.isOpen)
const cart = computed(() => cartState.items)
const total = cartTotal

const targetFreeShipping = 100
const progress = computed(() => Math.min((total.value / targetFreeShipping) * 100, 100))
const remainder = computed(() => Math.max(targetFreeShipping - total.value, 0).toFixed(2))

const closeCart = () => toggleCart(false)
const updateEq = (item, diff) => updateQuantity(item.id, diff)
const removeItem = (item) => removeFromCart(item.id)
</script>

<style scoped>
/* Flip Animation for quantity */
.flip-enter-active, .flip-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
}
.flip-enter-from {
  transform: rotateX(90deg) translateY(-10px); opacity: 0;
}
.flip-leave-to {
  transform: rotateX(-90deg) translateY(10px); opacity: 0;
}

/* List Transitions */
.list-enter-active, .list-leave-active {
  transition: all 0.4s var(--ease-bounce);
}
.list-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
.list-leave-active {
  position: absolute;
}

/* Drawer Transitions */
.drawer-enter-active, .drawer-leave-active {
  transition: transform 0.4s var(--ease-bounce);
}
.drawer-enter-from, .drawer-leave-to {
  transform: translateX(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
