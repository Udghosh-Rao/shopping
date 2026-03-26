import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: []
  }),
  actions: {
    show(message, type = 'info', duration = 3000) {
      const id = Date.now()
      this.toasts.push({ id, message, type })

      setTimeout(() => {
        this.remove(id)
      }, duration)
    },
    remove(id) {
      const index = this.toasts.findIndex(t => t.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },
    success(message, duration = 3000) {
      this.show(message, 'success', duration)
    },
    error(message, duration = 3000) {
      this.show(message, 'error', duration)
    },
    info(message, duration = 3000) {
      this.show(message, 'info', duration)
    }
  }
})
