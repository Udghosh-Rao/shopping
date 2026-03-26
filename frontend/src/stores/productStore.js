import { defineStore } from 'pinia'
import api from '../services/api'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    featured: [],
    categories: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    filters: {
      category: null,
      subcategory: null,
      badge: null,
      search: null,
      min_price: null,
      max_price: null,
      sort: 'newest'
    }
  }),
  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/products', { params })
        this.products = data.products
        this.currentPage = data.current_page
        this.totalPages = data.pages
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch products'
      } finally {
        this.loading = false
      }
    },
    async fetchFeatured() {
      try {
        const { data } = await api.get('/products/featured')
        this.featured = data
      } catch (error) {
        console.error('Failed to fetch featured products:', error)
      }
    },
    async fetchCategories() {
      try {
        const { data } = await api.get('/categories')
        this.categories = data
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    },
    async fetchById(id) {
      try {
        const { data } = await api.get(`/products/${id}`)
        return data
      } catch (error) {
        throw error
      }
    },
    setFilter(key, value) {
      this.filters[key] = value
      // Trigger product fetch with new filters
      this.fetchProducts({ ...this.filters, page: 1 })
    },
    resetFilters() {
      this.filters = {
        category: null,
        subcategory: null,
        badge: null,
        search: null,
        min_price: null,
        max_price: null,
        sort: 'newest'
      }
      this.fetchProducts()
    }
  }
})
