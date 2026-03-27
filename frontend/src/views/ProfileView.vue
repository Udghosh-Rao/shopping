<template>
  <div class="min-h-screen bg-white py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Account</h1>
        <p class="mt-2 text-gray-600">Welcome back, {{ authStore.username }}!</p>
      </div>

      <!-- Account Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Profile Info Card -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h2 class="ml-4 text-xl font-semibold text-gray-900">Profile Info</h2>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-gray-600">Username</p>
            <p class="font-medium text-gray-900">{{ authStore.username }}</p>
            <p class="text-sm text-gray-600 mt-3">Email</p>
            <p class="font-medium text-gray-900">{{ authStore.email }}</p>
          </div>
        </div>

        <!-- Orders Card -->
        <router-link to="/orders" class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <h2 class="ml-4 text-xl font-semibold text-gray-900">My Orders</h2>
          </div>
          <p class="text-gray-600">View your order history and track shipments</p>
          <div class="mt-4 flex items-center text-orange-600 font-medium">
            <span>View Orders</span>
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </router-link>

        <!-- Wishlist Card -->
        <router-link to="/wishlist" class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h2 class="ml-4 text-xl font-semibold text-gray-900">Wishlist</h2>
          </div>
          <p class="text-gray-600">{{ wishlistStore.items.length }} items saved for later</p>
          <div class="mt-4 flex items-center text-orange-600 font-medium">
            <span>View Wishlist</span>
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </router-link>

        <!-- Cart Card -->
        <router-link to="/cart" class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h2 class="ml-4 text-xl font-semibold text-gray-900">Shopping Cart</h2>
          </div>
          <p class="text-gray-600">{{ cartStore.items.length }} items in your cart</p>
          <div class="mt-4 flex items-center text-orange-600 font-medium">
            <span>View Cart</span>
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </router-link>

        <!-- Addresses Card -->
        <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h2 class="ml-4 text-xl font-semibold text-gray-900">Addresses</h2>
          </div>
          <p class="text-gray-600">Manage your delivery addresses</p>
          <div class="mt-4 flex items-center text-gray-400 font-medium">
            <span>Coming Soon</span>
          </div>
        </div>

        <!-- Logout Card -->
        <button @click="handleLogout" class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-red-300 transition-all text-left">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </div>
            <h2 class="ml-4 text-xl font-semibold text-gray-900">Logout</h2>
          </div>
          <p class="text-gray-600">Sign out of your account</p>
        </button>
      </div>

      <!-- Quick Actions -->
      <div class="mt-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-8 text-white">
        <h2 class="text-2xl font-bold mb-2">Continue Shopping</h2>
        <p class="mb-6 text-orange-100">Discover amazing products and exclusive deals</p>
        <router-link to="/products" class="inline-block bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
          Browse Products
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useToastStore } from '../stores/toastStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { showToast } = useToastStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  showToast('Logged out successfully', 'success')
  router.push('/')
}
</script>
