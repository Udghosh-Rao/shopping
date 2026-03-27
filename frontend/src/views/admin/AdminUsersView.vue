<template>
  <div class="min-h-screen bg-[var(--black)] pt-24 pb-12 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 class="text-4xl font-display font-black text-white tracking-widest uppercase">ADMIN USERS</h1>
        <router-link to="/admin" class="btn-glass">Dashboard</router-link>
      </div>

      <div class="glass-card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/10 text-left text-gray-400">
              <th class="p-4">User</th><th class="p-4">Email</th><th class="p-4">Role</th><th class="p-4">Active</th><th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-white/5 text-white">
              <td class="p-4">{{ user.username }}</td>
              <td class="p-4">{{ user.email }}</td>
              <td class="p-4 uppercase">{{ user.role }}</td>
              <td class="p-4">{{ user.is_active ? 'Yes' : 'No' }}</td>
              <td class="p-4 space-x-3">
                <button class="text-neon-cyan hover:text-cyan-300" @click="toggleRole(user)">
                  Make {{ user.role === 'admin' ? 'User' : 'Admin' }}
                </button>
                <button class="text-red-400 hover:text-red-300" @click="toggleActive(user)">
                  {{ user.is_active ? 'Disable' : 'Enable' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../../services/api'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()
const users = ref([])

const loadUsers = async () => {
  const { data } = await api.get('/admin/users', { params: { per_page: 100 } })
  users.value = data.users || []
}

const toggleRole = async (user) => {
  try {
    const role = user.role === 'admin' ? 'user' : 'admin'
    await api.put(`/admin/users/${user.id}`, { role })
    showToast('User role updated', 'success')
    await loadUsers()
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to update role', 'error')
  }
}

const toggleActive = async (user) => {
  try {
    await api.put(`/admin/users/${user.id}`, { is_active: !user.is_active })
    showToast('User status updated', 'success')
    await loadUsers()
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to update user status', 'error')
  }
}

onMounted(async () => {
  try {
    await loadUsers()
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to load users', 'error')
  }
})
</script>
