<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const error = ref('')
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: ''
})

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await authStore.register(form)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-md">
    <h1 class="text-2xl font-bold mb-4">Register</h1>
    <form class="space-y-3" @submit.prevent="submit">
      <input v-model="form.username" type="text" placeholder="Username" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
      <input v-model="form.email" type="email" placeholder="Email" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
      <input v-model="form.password" type="password" placeholder="Password" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button class="w-full bg-primary text-white rounded-lg px-4 py-3 shadow hover:bg-indigo-700 transition" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Register' }}
      </button>
    </form>
  </section>
</template>
