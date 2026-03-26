<template>
  <div class="fixed z-[140] right-4 bottom-4 sm:right-6 sm:bottom-6 left-4 sm:left-auto pointer-events-none">
    <div class="space-y-2 max-w-sm ml-auto">
      <TransitionGroup name="toast">
        <div
          v-for="toast in visibleToasts"
          :key="toast.id"
          class="pointer-events-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100"
          @mouseenter="pauseToast(toast.id)"
          @mouseleave="resumeToast(toast.id)"
        >
          <div class="flex items-start gap-3 p-3 relative">
            <span class="text-lg">{{ iconByType(toast.type) }}</span>
            <p class="text-sm font-semibold text-gray-800 flex-1">{{ toast.message }}</p>
            <button class="text-gray-400 hover:text-gray-600" @click="remove(toast.id)">✕</button>
            <div class="w-1 absolute inset-y-0 left-0" :class="barClass(toast.type)"></div>
          </div>
          <div class="h-1 w-full bg-gray-100 relative">
            <div class="h-full transition-all duration-100" :class="barClass(toast.type)" :style="{ width: `${progressMap[toast.id] ?? 100}%` }"></div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, reactive } from 'vue'
import { useToastStore } from '../stores/toastStore'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)

const visibleToasts = computed(() => toasts.value.slice(-3))
const progressMap = reactive({})
const pausedMap = reactive({})

let timer = null

function iconByType(type) {
  if (type === 'success') return '✅'
  if (type === 'error') return '❌'
  if (type === 'warning') return '⚠️'
  return 'ℹ️'
}

function barClass(type) {
  if (type === 'success') return 'bg-green-500'
  if (type === 'error') return 'bg-red-500'
  if (type === 'warning') return 'bg-yellow-500'
  return 'bg-orange-500'
}

function pauseToast(id) {
  pausedMap[id] = true
}

function resumeToast(id) {
  pausedMap[id] = false
}

function remove(id) {
  toastStore.remove(id)
  delete progressMap[id]
  delete pausedMap[id]
}

onMounted(() => {
  timer = setInterval(() => {
    visibleToasts.value.forEach((t) => {
      if (pausedMap[t.id]) return
      const duration = t.duration || 3000
      const step = 100 / (duration / 100)
      if (progressMap[t.id] === undefined) progressMap[t.id] = 100
      progressMap[t.id] = Math.max(0, progressMap[t.id] - step)
      if (progressMap[t.id] <= 0) remove(t.id)
    })
  }, 100)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(20px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }

@media (max-width: 640px) {
  .toast-enter-from { transform: translateY(-20px); }
  .toast-leave-to { transform: translateY(-20px); }
}
</style>
