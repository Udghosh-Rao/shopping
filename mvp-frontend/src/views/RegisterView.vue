<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import { setAuth } from '../stores/auth'

const router = useRouter()
const error = ref('')
const loading = ref(false)
const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user'
})

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await api.post('/auth/register', form)
    setAuth(data.token, data.user)
    if (data.user.role === 'organizer') {
      router.push('/organizer')
      return
    }
    router.push('/profile')
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="bg-white border rounded-lg p-6 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-4">Create account</h1>
    <form class="space-y-3" @submit.prevent="submit">
      <input v-model="form.name" class="w-full border rounded px-3 py-2" type="text" placeholder="Full name" required />
      <input v-model="form.email" class="w-full border rounded px-3 py-2" type="email" placeholder="Email" required />
      <input v-model="form.password" class="w-full border rounded px-3 py-2" type="password" placeholder="Password" required />

      <select v-model="form.role" class="w-full border rounded px-3 py-2">
        <option value="user">User</option>
        <option value="organizer">Organizer</option>
      </select>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button class="w-full bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Create account' }}
      </button>
    </form>
  </section>
</template>
