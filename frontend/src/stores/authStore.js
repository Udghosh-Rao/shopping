import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    email: localStorage.getItem('email') || null,
    role: localStorage.getItem('role') || 'user',
    isLoggedIn: !!localStorage.getItem('token')
  }),
  getters: {
    isAdmin: (state) => state.role === 'admin'
  },
  actions: {
    login(token, username, email, role = 'user') {
      this.token = token
      this.username = username
      this.email = email
      this.role = role
      this.isLoggedIn = true
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      localStorage.setItem('email', email)
      localStorage.setItem('role', role)
    },
    logout() {
      this.token = null
      this.username = null
      this.email = null
      this.role = 'user'
      this.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      localStorage.removeItem('role')
    },
    async fetchMe() {
      try {
        const { data } = await api.get('/auth/me')
        this.username = data.username
        this.email = data.email
        this.role = data.role || 'user'
        localStorage.setItem('role', this.role)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.logout()
      }
    }
  }
})
