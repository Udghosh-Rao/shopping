<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])
const cartStore = useCartStore()
const total = computed(() => cartStore.totalPrice.toFixed(2))
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-40">
    <div class="absolute inset-0 bg-black/30" @click="emit('close')"></div>
    <aside class="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-4 overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Cart</h3>
        <button @click="emit('close')">✕</button>
      </div>
      <div v-for="item in cartStore.items" :key="item.id" class="border-b py-3">
        <p class="font-medium">{{ item.product?.name }}</p>
        <p class="text-sm text-slate-600">Qty: {{ item.quantity }}</p>
      </div>
      <p class="mt-4 font-semibold">Total: ${{ total }}</p>
    </aside>
  </div>
</template>
