<template>
  <div class="min-h-screen bg-[var(--black)] relative pt-24 pb-12 overflow-hidden">
    <!-- Animated Gradients -->
    <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-neon-purple/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen -translate-y-1/2 translate-x-1/3"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-orange/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen translate-y-1/3 -translate-x-1/3"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">
      <!-- Page Header -->
      <div class="mb-12 reveal visible">
        <h1 class="text-5xl font-display font-black text-white tracking-widest uppercase mb-2">MY <span class="text-neon-orange drop-shadow-[0_0_10px_rgba(255,107,0,0.5)]">HQ</span></h1>
        <p class="text-gray-400 font-bold tracking-widest text-sm uppercase">Welcome back, {{ authStore.username }}</p>
      </div>

      <!-- Account Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
        
        <!-- Profile Info Card -->
        <div class="glass-card p-8 reveal visible flex flex-col justify-between h-full">
          <div>
            <div class="flex items-center mb-6">
              <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,107,0,0.2)] text-neon-orange">
                <span class="text-2xl">👤</span>
              </div>
              <h2 class="ml-4 text-2xl font-display font-bold text-white tracking-widest">IDENTITY</h2>
            </div>
            <div class="space-y-4">
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">RANK</p>
                <p class="font-bold text-neon-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">VIP MEMBER</p>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">USERNAME</p>
                <p class="font-bold text-white tracking-wider">{{ authStore.username }}</p>
              </div>
              <div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">ACCESS COMMLINK (EMAIL)</p>
                <p class="font-bold text-white tracking-wider truncate">{{ authStore.email }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Card -->
        <router-link to="/orders" class="glass-card p-8 reveal visible group cursor-pointer flex flex-col justify-between">
            <div class="flex items-center mb-6">
              <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] text-neon-purple transition-all">
                <span class="text-2xl">📦</span>
              </div>
              <h2 class="ml-4 text-2xl font-display font-bold text-white tracking-widest">DROPS</h2>
            </div>
            <p class="text-gray-400 font-bold text-sm tracking-widest mb-6">Track your successfully acquired limited gear.</p>
            <div class="mt-auto flex items-center text-neon-purple font-black tracking-widest uppercase text-xs">
              <span>VIEW INVENTORY</span><span class="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </div>
        </router-link>

        <!-- Wishlist Card -->
        <router-link to="/wishlist" class="glass-card p-8 reveal visible group cursor-pointer flex flex-col justify-between">
            <div class="flex items-center mb-6">
              <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 group-hover:shadow-[0_0_15px_rgba(255,45,120,0.3)] text-neon-pink transition-all">
                <span class="text-2xl">❤️</span>
              </div>
              <h2 class="ml-4 text-2xl font-display font-bold text-white tracking-widest">RADAR</h2>
            </div>
            <p class="text-gray-400 font-bold text-sm tracking-widest mb-6">{{ wishlistStore.items.length }} heat items locked on radar.</p>
            <div class="mt-auto flex items-center text-neon-pink font-black tracking-widest uppercase text-xs">
              <span>SCAN RADAR</span><span class="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </div>
        </router-link>

        <!-- Address Card -->
        <div class="glass-card p-8 reveal visible group">
            <div class="flex items-center mb-6">
              <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 text-neon-green transition-all">
                <span class="text-2xl">📍</span>
              </div>
              <h2 class="ml-4 text-2xl font-display font-bold text-white tracking-widest">LZ COORDS</h2>
            </div>
            <p class="text-gray-400 font-bold text-sm tracking-widest mb-6">Manage your landing zones for gear delivery.</p>
            <div class="mt-4 flex items-center gap-3">
              <span class="badge-neon badge-new px-3 py-1">OPERATIONAL</span>
            </div>
        </div>

        <router-link v-if="authStore.isAdmin" to="/admin" class="glass-card p-8 reveal visible group cursor-pointer flex flex-col justify-between">
            <div class="flex items-center mb-6">
              <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 group-hover:shadow-[0_0_15px_rgba(255,107,0,0.3)] text-neon-orange transition-all">
                <span class="text-2xl">🛠️</span>
              </div>
              <h2 class="ml-4 text-2xl font-display font-bold text-white tracking-widest">ADMIN</h2>
            </div>
            <p class="text-gray-400 font-bold text-sm tracking-widest mb-6">Manage products, orders, and users.</p>
            <div class="mt-auto flex items-center text-neon-orange font-black tracking-widest uppercase text-xs">
              <span>OPEN CONSOLE</span><span class="ml-2 group-hover:translate-x-2 transition-transform">→</span>
            </div>
        </router-link>

        <!-- Logout Card -->
        <div @click="handleLogout" class="glass-card p-8 reveal visible group cursor-pointer hover:border-red-500/50 hover:bg-red-500/10 transition-all flex flex-col justify-between">
          <div class="flex items-center mb-6">
            <div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center border border-white/20 text-red-500 transition-all text-2xl pb-1">
              <span>⏻</span>
            </div>
            <h2 class="ml-4 text-2xl font-display font-bold text-white tracking-widest">DISCONNECT</h2>
          </div>
          <p class="text-gray-400 font-bold text-sm tracking-widest mb-6">Terminate secure connection.</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useToast } from '../composables/useToast'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const { showToast } = useToast()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  showToast('Connection terminated.', 'info')
  router.push('/')
}
</script>
