<template>
  <div class="min-h-screen bg-[var(--black)] flex overflow-hidden">
    
    <!-- LEFT PANEL: Animated Art -->
    <div class="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden">
      <!-- Animated Gradient Bg -->
      <div class="absolute inset-0 anim-gradient pointer-events-none" style="background-image: var(--grad-neon); background-size: 400% 400%;"></div>
      <div class="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-none"></div>

      <!-- Floating Cards -->
      <div class="absolute top-20 left-20 w-72 h-96 glass-card p-4 anim-float rotate-[-10deg] opacity-70 border border-white/20 shadow-[0_0_50px_rgba(255,107,0,0.3)]">
        <div class="w-full h-full bg-white/10 rounded-2xl overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400" class="w-full h-full object-cover mix-blend-overlay" />
        </div>
      </div>
      <div class="absolute bottom-20 right-20 w-64 h-80 glass-card p-4 anim-float-slow rotate-[15deg] opacity-80 border border-white/20 shadow-[0_0_50px_rgba(139,92,246,0.3)]" style="animation-delay: 2s">
        <div class="w-full h-full bg-white/10 rounded-2xl overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=400" class="w-full h-full object-cover mix-blend-overlay" />
        </div>
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center text-white">
        <h1 class="text-[100px] font-display font-black tracking-widest mb-6 anim-neon drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] leading-none">
          ASH<span class="text-neon-orange">KAIR</span>
        </h1>
        <p class="text-2xl font-bold tracking-widest uppercase fadeUp text-neon-cyan drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" style="animation-delay: 0.5s">
          Welcome back to the future.
        </p>
      </div>
      
      <!-- Back to shop -->
      <RouterLink to="/" class="absolute top-8 left-8 flex items-center gap-2 text-white font-bold tracking-widest uppercase hover:text-neon-orange transition-colors z-20">
        <span>←</span> HOME
      </RouterLink>
    </div>

    <!-- RIGHT PANEL: Form -->
    <div class="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-[var(--dark-2)] shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-10 relative">
      <RouterLink to="/" class="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-white font-bold tracking-widest uppercase hover:text-neon-orange transition-colors">
        <span>←</span> HOME
      </RouterLink>

      <div class="w-full max-w-md stagger">
        <!-- Mobile Logo -->
        <h1 class="text-5xl font-display font-black tracking-widest mb-12 text-center lg:hidden anim-neon text-white mt-10">
          ASH<span class="text-neon-orange drop-shadow-[0_0_10px_rgba(255,107,0,0.5)]">KAIR</span>
        </h1>

        <h2 class="text-5xl font-display font-black text-white mb-2 fadeUp tracking-widest">SIGN IN</h2>
        <p class="text-gray-400 font-bold text-sm tracking-widest uppercase mb-12 fadeUp">Access your exclusive drops.</p>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-6 w-full">
          <div class="fadeUp">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">EMAIL</label>
            <input v-model="email" type="email" required class="input-dark w-full h-14 bg-black/50" placeholder="user@example.com" />
          </div>

          <div class="fadeUp">
            <div class="flex justify-between items-center mb-2 pl-2 pr-2">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">PASSWORD</label>
              <a href="#" class="text-xs font-bold text-neon-orange hover:text-white transition-colors">FORGOT?</a>
            </div>
            <input v-model="password" type="password" required class="input-dark w-full h-14 bg-black/50" placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            class="btn-glow-orange w-full h-16 text-lg font-black tracking-widest mt-6 fadeUp flex items-center justify-center overflow-hidden"
            @click="createRipple"
          >
            <span v-if="status === 'idle'">SIGN IN ➔</span>
            <span v-else-if="status === 'loading'" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else class="anim-bounceIn flex items-center gap-2">✓ WELCOME BACK</span>
          </button>
        </form>

        <p class="mt-12 text-center text-sm font-bold text-gray-400 tracking-widest fadeUp">
          NEW HERE? 
          <RouterLink to="/register" class="text-white hover:text-neon-orange underline underline-offset-4 ml-2 transition-colors">
            CREATE ACCOUNT
          </RouterLink>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useRipple } from '../composables/useRipple'
import { useAuthStore } from '../stores/authStore'
import { useToast } from '../composables/useToast'
import api from '../services/api'

const router = useRouter()
const authStore = useAuthStore()
const { createRipple } = useRipple()
const { showToast } = useToast()

const email = ref('')
const password = ref('')
const status = ref('idle')

const handleLogin = async (e) => {
  if (status.value !== 'idle') return
  status.value = 'loading'
  
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })
    
    const { token, username, email: returnedEmail } = response.data
    
    authStore.login(token, username, returnedEmail)
    
    status.value = 'success'
    showToast(`Welcome back, ${username}!`, 'success')
    
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    status.value = 'idle'
    const errorMessage = error.response?.data?.error || 'Invalid credentials. Please try again.'
    showToast(errorMessage, 'error')
  }
}
</script>

<style scoped>
.fadeUp {
  animation: fadeUp 0.6s var(--ease-bounce) both;
}
.stagger > *:nth-child(1) { animation-delay: 100ms; }
.stagger > *:nth-child(2) { animation-delay: 200ms; }
.stagger > *:nth-child(3) { animation-delay: 300ms; }
.stagger > *:nth-child(4) { animation-delay: 400ms; }
.stagger > *:nth-child(5) { animation-delay: 500ms; }
.stagger > *:nth-child(6) { animation-delay: 600ms; }
</style>
