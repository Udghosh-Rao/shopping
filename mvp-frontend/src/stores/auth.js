import { reactive } from 'vue'

const storedToken = localStorage.getItem('mvp_token')
const storedUser = localStorage.getItem('mvp_user')

export const authState = reactive({
  token: storedToken || '',
  user: storedUser ? JSON.parse(storedUser) : null
})

export function setAuth(token, user) {
  authState.token = token
  authState.user = user
  localStorage.setItem('mvp_token', token)
  localStorage.setItem('mvp_user', JSON.stringify(user))
}

export function clearAuth() {
  authState.token = ''
  authState.user = null
  localStorage.removeItem('mvp_token')
  localStorage.removeItem('mvp_user')
}

export function isAuthenticated() {
  return Boolean(authState.token)
}
