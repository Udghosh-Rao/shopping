<template>
  <div class="bg-white border-y border-gray-200 py-4">
    <div class="container mx-auto px-4">
      <div class="flex gap-3 overflow-x-auto scrollbar-hide">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="selectCategory(category.value)"
          class="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
          :class="activeCategory === category.value
            ? 'bg-black text-white'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'"
        >
          <span class="text-xl">{{ category.icon }}</span>
          <span class="whitespace-nowrap">{{ category.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activeCategory: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['select'])

const categories = [
  { value: null, label: 'All', icon: '🛍️' },
  { value: 'T-Shirts', label: 'T-Shirts', icon: '👕' },
  { value: 'Shirts', label: 'Shirts', icon: '👔' },
  { value: 'Sneakers', label: 'Sneakers', icon: '👟' },
  { value: 'Joggers', label: 'Joggers', icon: '👖' },
  { value: 'Accessories', label: 'Accessories', icon: '🎒' },
  { value: 'Phone Cases', label: 'Phone Cases', icon: '📱' },
  { value: 'Posters', label: 'Posters', icon: '🖼️' },
  { value: 'Mugs', label: 'Mugs', icon: '☕' }
]

const selectCategory = (value) => {
  emit('select', value)
}
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
