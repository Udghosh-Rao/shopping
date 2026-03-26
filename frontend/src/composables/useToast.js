import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const addToast = ({ message, type = 'info', duration = 3000 }) => {
    const id = Date.now()
    toasts.value.push({ id, message, type, duration })
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, addToast, removeToast }
}
