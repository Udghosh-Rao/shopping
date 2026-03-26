<template>
  <div v-if="isLoading" :class="fullPage ? 'fixed inset-0 bg-black/50 flex items-center justify-center z-50' : 'flex justify-center py-8'">
    <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#ff6b00] border-t-transparent"></div>
  </div>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: true
  },
  fullPage: {
    type: Boolean,
    default: false
  }
})
</script>
