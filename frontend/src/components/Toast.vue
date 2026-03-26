<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="toast-item glass-card dark px-5 py-4 w-80 pointer-events-auto relative overflow-hidden"
        :class="getBorderClass(toast.type)"
      >
        <div class="flex items-center gap-3 relative z-10">
          <span class="text-xl" v-if="toast.type === 'success'">✅</span>
          <span class="text-xl" v-else-if="toast.type === 'error'">🚨</span>
          <span class="text-xl" v-else>💡</span>
          <p class="text-sm font-medium text-white">{{ toast.message }}</p>
        </div>
        
        <!-- Progress Bar -->
        <div class="absolute bottom-0 left-0 h-1 w-full bg-white/10">
          <div 
            class="h-full toast-progress" 
            :class="getProgressClass(toast.type)"
            :style="{ animationDuration: toast.duration + 'ms' }"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast'

const { toasts } = useToast()

const getBorderClass = (type) => {
  if (type === 'success') return 'toast-success'
  if (type === 'error') return 'toast-error'
  return 'toast-info'
}

const getProgressClass = (type) => {
  if (type === 'success') return 'bg-neon-green'
  if (type === 'error') return 'bg-red-500'
  return 'bg-neon-orange'
}
</script>

<style scoped>
.toast-success { box-shadow: -4px 0 var(--neon-green); }
.toast-error   { box-shadow: -4px 0 #ef4444; }
.toast-info    { box-shadow: -4px 0 var(--neon-orange); }

.bg-neon-green  { background: var(--neon-green); }
.bg-neon-orange { background: var(--neon-orange); }

/* Shrink left to right */
.toast-progress {
  transform-origin: left;
  animation: shrinkProgress linear forwards;
}
@keyframes shrinkProgress {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

/* Toast Transitions */
.toast-enter-active {
  transition: all 0.5s var(--ease-bounce);
}
.toast-leave-active {
  transition: all 0.3s var(--ease-smooth);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(120%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
