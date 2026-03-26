import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    username: localStorage.getItem('username') || null,
    email: localStorage.getItem('email') || null,
    isLoggedIn: !!localStorage.getItem('token')
  }),
  actions: {
    login(token, username, email) {
      this.token = token
      this.username = username
      this.email = email
      this.isLoggedIn = true
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
      localStorage.setItem('email', email)
    },
    logout() {
      this.token = null
      this.username = null
      this.email = null
      this.isLoggedIn = false
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
    },
    async fetchMe() {
      try {
        const { data } = await api.get('/auth/me')
        this.username = data.username
        this.email = data.email
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.logout()
      }
    }
  }
})
