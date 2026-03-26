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
      <form class="w-full max-w-lg" @submit.prevent="handleRegister">
        <h2 class="text-5xl" style="font-family: var(--font-display)">CREATE ACCOUNT</h2>
        <p class="text-gray-500 mt-1">Join ShopZone today</p>

        <div class="mt-6 grid sm:grid-cols-2 gap-4">
          <input v-model="firstName" class="input-field" placeholder="First Name" required />
          <input v-model="lastName" class="input-field" placeholder="Last Name" required />
          <input v-model="email" type="email" class="input-field sm:col-span-2" placeholder="Email" required />
          <input v-model="phone" class="input-field sm:col-span-2" placeholder="Phone" />
          <input v-model="password" type="password" class="input-field sm:col-span-2" placeholder="Password" required />
          <input v-model="confirmPassword" type="password" class="input-field sm:col-span-2" placeholder="Confirm Password" required />
        </div>

        <div class="mt-3">
          <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div class="h-full transition-all" :class="strength.color" :style="{ width: strength.width }"></div>
          </div>
          <p class="text-xs mt-1" :class="strength.text">Password strength: {{ strength.label }}</p>
        </div>

        <label class="mt-4 flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" v-model="accepted" class="mt-1" />
          <span>I agree to Terms & Privacy Policy</span>
        </label>

        <button class="btn-primary w-full justify-center mt-5" :disabled="loading">{{ loading ? 'CREATING...' : 'CREATE ACCOUNT →' }}</button>

        <p class="text-sm text-gray-600 mt-4 text-center">
          Already have an account?
          <RouterLink to="/login" class="text-orange-500 font-semibold">Login</RouterLink>
        </p>
      </form>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '../components/Toast.vue'
import api from '../services/api'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const accepted = ref(false)
const loading = ref(false)

const strength = computed(() => {
  const val = password.value
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++

  if (score <= 1) return { label: 'Weak', width: '25%', color: 'bg-red-500', text: 'text-red-500' }
  if (score <= 3) return { label: 'Medium', width: '65%', color: 'bg-yellow-500', text: 'text-yellow-600' }
  return { label: 'Strong', width: '100%', color: 'bg-green-500', text: 'text-green-600' }
})

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    toastStore.error('Passwords do not match')
    return
  }
  if (!accepted.value) {
    toastStore.error('Please accept Terms & Privacy Policy')
    return
  }

  try {
    loading.value = true
    const { data } = await api.post('/auth/register', {
      username: `${firstName.value} ${lastName.value}`.trim(),
      email: email.value,
      phone: phone.value,
      password: password.value
    })
    authStore.login(data.token, data.username, data.email)
    toastStore.success(`🎉 Welcome to ShopZone, ${data.username}!`)
    router.push('/')
  } catch (error) {
    toastStore.error(error.response?.data?.error || 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>
