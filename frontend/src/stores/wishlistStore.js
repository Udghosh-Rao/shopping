import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('wishlist') || '[]')
  }),
  getters: {
    isWishlisted: (state) => (productId) => {
      return state.items.includes(productId)
    }
  },
  actions: {
    toggle(productId) {
      const index = this.items.indexOf(productId)
      if (index > -1) {
        this.items.splice(index, 1)
      } else {
        this.items.push(productId)
      }
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      localStorage.setItem('wishlist', JSON.stringify(this.items))
    }
  }
})
