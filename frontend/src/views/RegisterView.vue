<template>
  <div class="min-h-screen bg-[var(--black)] flex overflow-hidden">
    
    <!-- LEFT PANEL: Dark Form -->
    <div class="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-[var(--dark-2)] shadow-[20px_0_50px_rgba(0,0,0,0.8)] z-10 relative">
      <RouterLink to="/" class="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-white font-bold tracking-widest uppercase hover:text-neon-purple transition-colors">
        <span>←</span> HOME
      </RouterLink>

      <div class="w-full max-w-md stagger">
        <!-- Mobile Logo -->
        <h1 class="text-5xl font-display font-black tracking-widest mb-12 text-center lg:hidden anim-neon text-white mt-10">
          ASH<span class="text-neon-purple drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">KAIR</span>
        </h1>

        <h2 class="text-5xl font-display font-black text-white mb-2 fadeUp tracking-widest">JOIN THE CLUB</h2>
        <p class="text-gray-400 font-bold text-sm tracking-widest uppercase mb-10 fadeUp">Get early access to exclusive drops.</p>

        <form @submit.prevent="handleRegister" class="flex flex-col gap-6 w-full">
          <div class="flex gap-4 fadeUp">
            <div class="flex-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">FIRST NAME</label>
              <input v-model="firstName" type="text" required class="input-dark w-full h-14 bg-black/50" placeholder="Alex" />
            </div>
            <div class="flex-1">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">LAST NAME</label>
              <input v-model="lastName" type="text" required class="input-dark w-full h-14 bg-black/50" placeholder="Chen" />
            </div>
          </div>

          <div class="fadeUp">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">EMAIL</label>
            <input v-model="email" type="email" required class="input-dark w-full h-14 bg-black/50" placeholder="user@example.com" />
          </div>

          <div class="fadeUp">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-2">PASSWORD</label>
            <input v-model="password" type="password" required class="input-dark w-full h-14 bg-black/50" placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            class="btn-glow-purple w-full h-16 text-lg font-black tracking-widest mt-6 fadeUp flex items-center justify-center overflow-hidden"
            @click="createRipple"
          >
            <span v-if="status === 'idle'">CREATE ACCOUNT ➔</span>
            <span v-else-if="status === 'loading'" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else class="anim-bounceIn flex items-center gap-2">✓ ACCOUNT CREATED</span>
          </button>
        </form>

        <p class="mt-12 text-center text-sm font-bold text-gray-400 tracking-widest fadeUp">
          ALREADY A MEMBER? 
          <RouterLink to="/login" class="text-white hover:text-neon-purple underline underline-offset-4 ml-2 transition-colors">
            SIGN IN
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- RIGHT PANEL: Animated Art -->
    <div class="hidden lg:flex flex-1 relative items-center justify-center p-12 overflow-hidden bg-[var(--black)]">
      <!-- Animated Gradient Bg -->
      <div class="absolute inset-0 anim-gradient pointer-events-none opacity-40 mix-blend-screen" style="background-image: var(--grad-purple); background-size: 400% 400%;"></div>

      <!-- Floating Elements -->
      <div class="absolute top-[30%] right-[30%] w-48 h-48 rounded-full border-4 border-neon-cyan/50 anim-float shadow-[0_0_40px_rgba(6,182,212,0.4)]"></div>
      <div class="absolute bottom-[20%] left-[20%] w-64 h-64 rounded-full border-2 border-neon-pink/40 anim-float-slow shadow-[0_0_30px_rgba(255,45,120,0.3)]" style="animation-delay: 1s;"></div>
      
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <!-- Content -->
      <div class="relative z-10 text-center text-white">
        <h1 class="text-[100px] font-display font-black tracking-widest mb-6 drop-shadow-[0_0_40px_rgba(139,92,246,0.8)] leading-none">
          BE A<br/><span class="text-transparent bg-clip-text" style="background-image: var(--grad-purple)">CREATOR</span>
        </h1>
        <p class="text-2xl font-bold tracking-widest uppercase fadeUp text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" style="animation-delay: 0.5s">
          Join 6 million hypebeasts.
        </p>
      </div>

      <!-- Back to shop -->
      <RouterLink to="/" class="absolute top-8 right-8 flex items-center gap-2 text-white font-bold tracking-widest uppercase hover:text-neon-purple transition-colors z-20">
        HOME <span>→</span>
      </RouterLink>
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

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const status = ref('idle')

const handleRegister = async (e) => {
  if (status.value !== 'idle') return
  status.value = 'loading'
  
  try {
    const username = `${firstName.value} ${lastName.value}`.trim()
    
    const response = await api.post('/auth/register', {
      username,
      email: email.value,
      password: password.value
    })
    
    const { token, username: returnedUsername, email: returnedEmail, role } = response.data
    
    authStore.login(token, returnedUsername, returnedEmail, role || 'user')
    
    status.value = 'success'
    showToast('Account created successfully! Welcome to ShopZone', 'success')
    
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    status.value = 'idle'
    const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.'
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
