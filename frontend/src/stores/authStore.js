import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || '',
    isAuthenticated: !!localStorage.getItem('token')
  }),
  actions: {
    async login(payload) {
      const { data } = await api.post('/auth/login', payload)
      this.token = data.token
      this.user = data.user
      this.isAuthenticated = true
      localStorage.setItem('token', data.token)
    },
    async register(payload) {
      const { data } = await api.post('/auth/register', payload)
      this.token = data.token
      this.user = data.user
      this.isAuthenticated = true
      localStorage.setItem('token', data.token)
    },
    async fetchUser() {
      if (!this.token) return
      const { data } = await api.get('/auth/me')
      this.user = data.user
      this.isAuthenticated = true
    },
    logout() {
      this.user = null
      this.token = ''
      this.isAuthenticated = false
      localStorage.removeItem('token')
    }
  }
})
