<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { authState, clearAuth } from './stores/auth'

const router = useRouter()
const user = computed(() => authState.user)

function logout() {
  clearAuth()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen">
    <header class="bg-white border-b">
      <nav class="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center gap-3">
        <RouterLink class="font-bold text-slate-900" to="/profile">Auth MVP</RouterLink>

        <RouterLink class="text-sm text-blue-600" to="/login">Login</RouterLink>
        <RouterLink class="text-sm text-blue-600" to="/register">Register</RouterLink>

        <RouterLink v-if="user" class="text-sm text-blue-600" to="/profile">Profile</RouterLink>
        <RouterLink v-if="user?.role === 'organizer'" class="text-sm text-blue-600" to="/organizer">
          Organizer
        </RouterLink>

        <div class="ml-auto flex items-center gap-3" v-if="user">
          <p class="text-sm text-slate-700">{{ user.name }} ({{ user.role }})</p>
          <button
            class="bg-slate-900 text-white text-sm px-3 py-1 rounded"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>

    <main class="max-w-4xl mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>
