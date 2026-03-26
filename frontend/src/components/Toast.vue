<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="px-6 py-3 rounded-lg shadow-lg text-white font-medium min-w-[300px] animate-slide-in"
      :class="{
        'bg-green-500': toast.type === 'success',
        'bg-red-500': toast.type === 'error',
        'bg-blue-500': toast.type === 'info'
      }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useToastStore } from '../stores/toastStore'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
