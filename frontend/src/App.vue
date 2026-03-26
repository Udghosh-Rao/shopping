<template>
  <div class="min-h-screen bg-white">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from './stores/cartStore'

const cartStore = useCartStore()

onMounted(() => {
  // Initialize cart from localStorage
  cartStore.items
})
</script>
