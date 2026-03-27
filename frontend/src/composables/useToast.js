import { reactive } from 'vue'

const state = reactive({ toasts: [] })
let _id = 0

export const useToast = () => {
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = ++_id
    state.toasts.push({ id, message, type, duration })
    setTimeout(() => {
      const i = state.toasts.findIndex((t) => t.id === id)
      if (i > -1) state.toasts.splice(i, 1)
    }, duration)
  }

  return { toasts: state.toasts, showToast }
}
