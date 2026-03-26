<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '../api'
import { authState, setAuth } from '../stores/auth'

const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')
const form = reactive({
  name: '',
  email: ''
})

async function loadProfile() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/profile')
    form.name = data.user.name
    form.email = data.user.email
    setAuth(authState.token, data.user)
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to load profile'
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  error.value = ''
  success.value = ''
  try {
    const { data } = await api.put('/profile', {
      name: form.name,
      email: form.email
    })
    setAuth(authState.token, data.user)
    success.value = 'Profile updated successfully'
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to save profile'
  } finally {
    saving.value = false
  }
}

onMounted(loadProfile)
</script>

<template>
  <section class="bg-white border rounded-lg p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Your profile</h1>

    <p v-if="loading" class="text-slate-600">Loading profile...</p>

    <form v-else class="space-y-3" @submit.prevent="saveProfile">
      <input v-model="form.name" class="w-full border rounded px-3 py-2" type="text" placeholder="Full name" required />
      <input v-model="form.email" class="w-full border rounded px-3 py-2" type="email" placeholder="Email" required />
      <p class="text-sm text-slate-600">Role: <strong>{{ authState.user?.role }}</strong></p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-if="success" class="text-sm text-green-600">{{ success }}</p>
      <button class="bg-slate-900 text-white px-4 py-2 rounded disabled:opacity-50" :disabled="saving">
        {{ saving ? 'Saving...' : 'Update profile' }}
      </button>
    </form>
  </section>
</template>
