<template>
  <div class="flex items-center gap-1">
    <span v-for="i in 5" :key="i" class="text-lg">
      <span v-if="i <= Math.floor(rating)">★</span>
      <span v-else-if="i === Math.ceil(rating) && rating % 1 !== 0">½</span>
      <span v-else class="text-gray-300">★</span>
    </span>
    <span v-if="reviewCount" class="text-sm text-gray-600 ml-1">
      ({{ rating }}) · {{ reviewCount }} reviews
    </span>
  </div>
</template>

<script setup>
defineProps({
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
})
</script>
