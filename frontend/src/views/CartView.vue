<template>
  <div class="min-h-screen bg-[var(--black)] relative pt-24 pb-12 overflow-hidden">
    <!-- Animated Gradients -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-cyan/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen -translate-y-1/2 translate-x-1/3"></div>

    <div class="container mx-auto px-6 max-w-6xl relative z-10">
      <h1 class="text-5xl font-display font-black text-white tracking-widest uppercase mb-12">SHOPPING <span class="text-neon-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">CART</span></h1>

      <div v-if="cartStore.isEmpty" class="glass-card text-center py-24 flex flex-col items-center">
        <span class="text-7xl mb-8 anim-float block">🛒</span>
        <h2 class="text-3xl font-display font-black text-white tracking-widest uppercase mb-4">YOUR CART IS EMPTY</h2>
        <p class="text-xl font-bold text-gray-400 tracking-widest mb-10">Gear up and grab some heat.</p>
        <RouterLink to="/products" class="btn-glow-cyan">
          EXPLORE GEAR →
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-6 stagger">
          <div v-for="(item, index) in cartStore.items" :key="index" class="glass-card p-6 flex gap-6 items-center reveal visible" :style="{ transitionDelay: `${index * 100}ms` }">
            <div class="w-28 h-28 bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative flex-shrink-0">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover mix-blend-overlay opacity-90 hover:opacity-100 hover:scale-110 transition-all duration-500" />
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-white text-xl tracking-wider mb-2 uppercase">{{ item.name }}</h3>
              <p class="text-xs font-bold text-gray-400 tracking-widest mb-4">SIZE: {{ item.size }} | COLOR: {{ item.color }}</p>
              
              <div class="flex items-center gap-6">
                <p class="font-black text-neon-orange tracking-widest text-lg">₹{{ item.price }}</p>
                <div class="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-4 py-1">
                  <button @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity - 1)" class="text-white hover:text-neon-cyan transition-colors font-black text-xl w-6 h-6 flex items-center justify-center">-</button>
                  <span class="font-bold text-white">{{ item.quantity }}</span>
                  <button @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity + 1)" class="text-white hover:text-neon-cyan transition-colors font-black text-xl w-6 h-6 flex items-center justify-center">+</button>
                </div>
              </div>
            </div>
            <div class="text-right flex flex-col items-end justify-between h-full">
              <p class="font-black text-2xl text-white tracking-widest mb-4">₹{{ item.price * item.quantity }}</p>
              <button @click="cartStore.removeItem(item.id, item.size, item.color)" class="text-gray-500 hover:text-red-500 text-sm font-bold tracking-widest uppercase transition-colors flex items-center gap-2">
                <span>✕</span> REMOVE
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="glass-card p-8 sticky top-28">
            <h2 class="font-display font-black text-2xl text-white tracking-widest mb-8 border-b border-white/10 pb-4">SUMMARY</h2>
            
            <div class="space-y-4 mb-8">
              <div class="flex justify-between items-center text-sm font-bold tracking-widest text-gray-400">
                <span>SUBTOTAL</span>
                <span class="text-white text-lg">₹{{ cartStore.totalPrice }}</span>
              </div>
              <div class="flex justify-between items-center text-sm font-bold tracking-widest text-gray-400 border-b border-white/10 pb-6">
                <span>SHIPPING</span>
                <span class="text-neon-cyan">{{ cartStore.totalPrice >= 499 ? 'FREE' : '₹49' }}</span>
              </div>
              <div class="pt-2 flex justify-between items-center text-lg font-black tracking-widest text-white">
                <span>TOTAL</span>
                <span class="text-3xl text-neon-orange drop-shadow-[0_0_10px_rgba(255,107,0,0.3)]">₹{{ cartStore.totalPrice + (cartStore.totalPrice >= 499 ? 0 : 49) }}</span>
              </div>
            </div>

            <RouterLink to="/checkout" class="btn-glow-cyan w-full mb-4 flex justify-center text-center">
              SECURE CHECKOUT →
            </RouterLink>
            
            <button @click="cartStore.clearCart()" class="w-full py-4 border border-red-500/30 text-red-500/70 hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all rounded-lg font-bold tracking-widest text-sm uppercase">
              CLEAR CART
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cartStore'

const cartStore = useCartStore()
</script>
