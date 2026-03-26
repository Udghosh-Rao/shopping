<script setup>
import { onMounted, ref } from 'vue'
import api from '../api'

const loading = ref(false)
const error = ref('')
const data = ref(null)

async function loadOrganizerData() {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/organizer/overview')
    data.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error || 'Failed to load organizer data'
  } finally {
    loading.value = false
  }
}

onMounted(loadOrganizerData)
</script>

<template>
  <section class="bg-white border rounded-lg p-6 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Organizer dashboard</h1>

    <p v-if="loading" class="text-slate-600">Loading dashboard...</p>
    <p v-else-if="error" class="text-red-600">{{ error }}</p>

    <div v-else-if="data" class="space-y-2">
      <p class="font-medium text-green-700">{{ data.message }}</p>
      <ul class="list-disc ml-6 text-slate-700">
        <li>Active events: {{ data.metrics.activeEvents }}</li>
        <li>Pending approvals: {{ data.metrics.pendingApprovals }}</li>
        <li>Tickets sold today: {{ data.metrics.ticketsSoldToday }}</li>
      </ul>
    </div>
  </section>
</template>
