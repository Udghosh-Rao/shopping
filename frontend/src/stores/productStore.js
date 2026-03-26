import { defineStore } from 'pinia'
import api from '../services/api'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      this.error = ''
      try {
        const { data } = await api.get('/products', { params })
        this.products = data.data
        this.categories = data.categories
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch products'
      } finally {
        this.loading = false
      }
    },
    async fetchById(id) {
      const { data } = await api.get(`/products/${id}`)
      return data
    },
    async searchProducts(search, category = '') {
      await this.fetchProducts({ search, category })
    }
  }
})
