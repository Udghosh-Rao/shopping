<template>
  <div class="min-h-screen lg:grid lg:grid-cols-2">
    <div class="hidden lg:flex bg-gradient-to-br from-[#0d0d0d] to-[#1a1a2e] text-white p-12 relative overflow-hidden items-center">
      <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 24px 24px"></div>
      <div class="relative z-10 max-w-md mx-auto">
        <h1 class="text-7xl" style="font-family: var(--font-display)">SHOPZONE</h1>
        <p class="tracking-[0.2em] text-gray-300">WEAR YOUR FANDOM</p>
        <div class="mt-10 space-y-5 text-sm">
          <p>✅ Access to 2000+ Licensed Designs</p>
          <p>🚀 Lightning Fast Checkout</p>
          <p>🎁 Exclusive Member Discounts</p>
        </div>
      </div>
    </div>

    <div class="bg-white flex items-center justify-center px-4 py-10">
      <form class="w-full max-w-md" @submit.prevent="handleLogin">
        <h2 class="text-5xl" style="font-family: var(--font-display)">WELCOME BACK</h2>
        <p class="text-gray-500 mt-1">Login to your account</p>

        <div class="mt-6 space-y-4">
          <input v-model="email" type="email" required class="input-field" placeholder="Email" />
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" required class="input-field pr-12" placeholder="Password" />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" @click="showPassword = !showPassword">{{ showPassword ? '🙈' : '👁️' }}</button>
          </div>
          <div class="text-right"><a class="text-orange-500 text-sm">Forgot Password?</a></div>
          <button class="btn-primary w-full justify-center" :disabled="loading">{{ loading ? 'LOGGING IN...' : 'LOGIN →' }}</button>
        </div>

        <div class="my-5 flex items-center gap-2 text-gray-400 text-sm"><span class="h-px bg-gray-200 flex-1"></span>OR<span class="h-px bg-gray-200 flex-1"></span></div>

        <button type="button" class="w-full border rounded-full py-3 font-semibold">🟢 Continue with Google</button>

        <p class="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?
          <RouterLink to="/register" class="text-orange-500 font-semibold">Register</RouterLink>
        </p>
      </form>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Toast from '../components/Toast.vue'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function handleLogin() {
  try {
    loading.value = true
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
    authStore.login(data.token, data.username, data.email)
    toastStore.success(`👋 Welcome back, ${data.username}!`)
    router.push(route.query.redirect || '/')
  } catch (error) {
    toastStore.error(error.response?.data?.error || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>
