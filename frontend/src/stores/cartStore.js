import { defineStore } from 'pinia'
import api from '../services/api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0)
  },
  actions: {
    async syncWithBackend() {
      const { data } = await api.get('/cart')
      this.items = data
    },
    async addItem(product, quantity = 1) {
      await api.post('/cart/add', { product_id: product.id, quantity })
      await this.syncWithBackend()
    },
    async removeItem(cartId) {
      await api.delete(`/cart/remove/${cartId}`)
      this.items = this.items.filter((item) => item.id !== cartId)
    },
    async updateQuantity(cartId, quantity) {
      if (quantity <= 0) return this.removeItem(cartId)
      await api.put(`/cart/update/${cartId}`, { quantity })
      await this.syncWithBackend()
    },
    async clearCart() {
      await api.delete('/cart/clear')
      this.items = []
    }
  }
})
