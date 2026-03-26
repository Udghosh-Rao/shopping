<template>
  <div class="relative">
    <input
      v-model="searchQuery"
      @keyup.enter="search"
      type="text"
      placeholder="Search for products..."
      class="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b00] focus:border-transparent"
    />
    <svg
      class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <button
      v-if="searchQuery"
      @click="clear"
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const emit = defineEmits(['search'])

const search = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value)
  }
}

const clear = () => {
  searchQuery.value = ''
  emit('search', '')
}
</script>
