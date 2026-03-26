import { createRouter, createWebHistory } from 'vue-router'
import { authState, isAuthenticated } from './stores/auth'

import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import ProfileView from './views/ProfileView.vue'
import OrganizerView from './views/OrganizerView.vue'

const routes = [
  { path: '/', redirect: '/profile' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/profile', component: ProfileView, meta: { requiresAuth: true } },
  {
    path: '/organizer',
    component: OrganizerView,
    meta: { requiresAuth: true, roles: ['organizer'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return '/login'
  }

  const allowedRoles = to.meta.roles
  if (allowedRoles && authState.user && !allowedRoles.includes(authState.user.role)) {
    return '/profile'
  }

  return true
})

export default router
