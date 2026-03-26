import { defineStore } from 'pinia'
import api from '../services/api'
import { useAuthStore } from './authStore'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]')
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    isEmpty: (state) => state.items.length === 0
  },
  actions: {
    addItem(product, size, color) {
      // Check if item with same product, size, color exists
      const existingItem = this.items.find(
        item => item.id === product.id && item.size === size && item.color === color
      )

      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url,
          size,
          color,
          quantity: 1
        })
      }

      this.saveToLocalStorage()
      this.syncWithBackend()
    },
    removeItem(id, size, color) {
      this.items = this.items.filter(
        item => !(item.id === id && item.size === size && item.color === color)
      )
      this.saveToLocalStorage()
    },
    updateQuantity(id, size, color, newQty) {
      const item = this.items.find(
        item => item.id === id && item.size === size && item.color === color
      )
      if (item) {
        item.quantity = newQty
        this.saveToLocalStorage()
      }
    },
    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },
    async syncWithBackend() {
      const authStore = useAuthStore()
      if (!authStore.isLoggedIn) return

      try {
        // Sync cart items to backend
        for (const item of this.items) {
          await api.post('/cart/add', {
            product_id: item.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color
          })
        }
      } catch (error) {
        console.error('Failed to sync cart:', error)
      }
    }
  }
})
