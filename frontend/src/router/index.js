import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// Lazy load views
const HomeView = () => import('../views/HomeView.vue')
const ProductsView = () => import('../views/ProductsView.vue')
const ProductDetailView = () => import('../views/ProductDetailView.vue')
const CartView = () => import('../views/CartView.vue')
const CheckoutView = () => import('../views/CheckoutView.vue')
const OrderSuccessView = () => import('../views/OrderSuccessView.vue')
const LoginView = () => import('../views/LoginView.vue')
const RegisterView = () => import('../views/RegisterView.vue')
const WishlistView = () => import('../views/WishlistView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsView
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: ProductDetailView
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-success',
    name: 'order-success',
    component: OrderSuccessView,
    meta: { requiresAuth: true }
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: WishlistView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guestOnly: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Protected routes
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Save the intended destination
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Guest only routes (redirect to home if already logged in)
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return next({ name: 'home' })
  }

  next()
})

export default router
