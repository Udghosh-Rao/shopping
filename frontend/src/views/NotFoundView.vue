<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a2e] flex items-center justify-center px-4">
    <div class="text-center text-white">
      <h1 class="text-9xl font-black mb-4">404</h1>
      <h2 class="text-3xl font-bold mb-4">Oops! Page not found</h2>
      <p class="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <RouterLink to="/" class="inline-block px-8 py-4 bg-[#ff6b00] text-white rounded-lg font-bold hover:bg-[#ff8533] transition">
        BACK TO HOME
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
