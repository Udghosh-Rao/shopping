<template>
  <section class="container mx-auto px-4 py-12">
    <div class="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a0000] to-[#2d0000] text-white p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <h2 class="text-5xl bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text" style="font-family: var(--font-display)">⚡ FLASH SALE</h2>
        <div class="flex items-center gap-2">
          <div v-for="part in timerParts" :key="part.label" class="text-center bg-black/40 rounded-xl px-4 py-2 min-w-20">
            <p class="text-2xl font-black">{{ part.value }}</p>
            <p class="text-[10px] tracking-[0.2em] text-gray-300">{{ part.label }}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="product in products" :key="product.id" class="relative">
          <div class="absolute top-3 left-0 z-10 bg-red-600 text-xs font-black px-3 py-1 rounded-r-full">SALE ENDS SOON</div>
          <ProductCard :product="product" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import api from '../services/api'
import ProductCard from './ProductCard.vue'

const products = ref([])
const endsAt = ref(null)
const now = ref(Date.now())
let timer = null

const diffMs = computed(() => {
  if (!endsAt.value) return 0
  return Math.max(0, new Date(endsAt.value).getTime() - now.value)
})

const timerParts = computed(() => {
  const total = Math.floor(diffMs.value / 1000)
  const hrs = String(Math.floor(total / 3600)).padStart(2, '0')
  const mins = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const secs = String(total % 60).padStart(2, '0')
  return [
    { label: 'HRS', value: hrs },
    { label: 'MINS', value: mins },
    { label: 'SECS', value: secs }
  ]
})

onMounted(async () => {
  const { data } = await api.get('/flash-sale')
  products.value = data.products || []
  endsAt.value = data.ends_at
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>
