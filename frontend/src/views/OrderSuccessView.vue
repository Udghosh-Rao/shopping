<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-16 text-center max-w-2xl">
      <div class="bg-white rounded-lg shadow-lg p-12">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <span class="text-4xl">✓</span>
        </div>
        <h1 class="text-4xl font-black mb-4">ORDER PLACED SUCCESSFULLY! 🎉</h1>
        <p class="text-gray-600 mb-8">
          Thank you for your order. You will receive a confirmation email shortly.
        </p>
        <RouterLink to="/products" class="inline-block px-8 py-4 bg-[#ff6b00] text-white rounded-lg font-bold hover:bg-[#ff8533] transition">
          CONTINUE SHOPPING
        </RouterLink>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
</script>
