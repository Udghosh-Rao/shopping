<template>
  <div>
    <Navbar />
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <Footer />
    <CartDrawer />
    <Toast />
  </div>
</template>

<script setup>
import { useCursorGlow } from './composables/useCursorGlow'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CartDrawer from './components/CartDrawer.vue'
import Toast from './components/Toast.vue'
import { RouterView } from 'vue-router'

useCursorGlow()
</script>

<style>
/* PAGE TRANSITION */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.35s var(--ease-smooth),
              transform 0.35s var(--ease-smooth);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
