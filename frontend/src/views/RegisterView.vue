<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a2e] flex items-center justify-center px-4">
    <div class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
      <h1 class="text-3xl font-black text-center mb-2">CREATE ACCOUNT</h1>
      <p class="text-center text-gray-600 mb-6">Join ShopZone today</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-bold mb-2">USERNAME</label>
          <input v-model="username" type="text" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" placeholder="johndoe" />
        </div>
        <div>
          <label class="block text-sm font-bold mb-2">EMAIL</label>
          <input v-model="email" type="email" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" placeholder="your.email@example.com" />
        </div>
        <div>
          <label class="block text-sm font-bold mb-2">PHONE</label>
          <input v-model="phone" type="tel" class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" placeholder="9876543210" />
        </div>
        <div>
          <label class="block text-sm font-bold mb-2">PASSWORD</label>
          <input v-model="password" type="password" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" placeholder="••••••••" />
        </div>
        <div>
          <label class="block text-sm font-bold mb-2">CONFIRM PASSWORD</label>
          <input v-model="confirmPassword" type="password" required class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ff6b00]" placeholder="••••••••" />
        </div>
        <button type="submit" :disabled="loading" class="w-full py-3 bg-[#ff6b00] text-white rounded-lg font-bold hover:bg-[#ff8533] transition disabled:opacity-50">
          {{ loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT' }}
        </button>
      </form>

      <p class="text-center mt-6 text-sm">
        Already have an account?
        <RouterLink to="/login" class="text-[#ff6b00] font-bold hover:underline">Login</RouterLink>
      </p>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToastStore } from '../stores/toastStore'
import api from '../services/api'
import { RouterLink } from 'vue-router'
import Toast from '../components/Toast.vue'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const username = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    toastStore.error('Passwords do not match')
    return
  }

  try {
    loading.value = true
    const { data } = await api.post('/auth/register', {
      username: username.value,
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
