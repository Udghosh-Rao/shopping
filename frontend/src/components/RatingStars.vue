<template>
  <div class="flex items-center gap-0.5">
    <span v-for="i in 5" :key="i" class="text-lg leading-none">
      <span v-if="i <= Math.floor(rating)" class="text-yellow-400">★</span>
      <span v-else-if="i === Math.ceil(rating) && rating % 1 >= 0.5" class="text-yellow-400 opacity-50">★</span>
      <span v-else class="text-gray-700">★</span>
    </span>
    <span v-if="reviewCount" class="text-xs font-bold text-gray-500 tracking-wide ml-2">
      {{ rating.toFixed(1) }} <span class="text-gray-700">({{ reviewCount }})</span>
    </span>
  </div>
</template>

<script setup>
defineProps({
  rating: { type: Number, required: true, default: 0 },
  reviewCount: { type: Number, default: 0 }
})
</script>
