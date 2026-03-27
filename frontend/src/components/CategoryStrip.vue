<template>
  <div class="bg-[var(--dark-2)] border-y border-white/10 py-4">
    <div class="container mx-auto px-4">
      <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        <button
          v-for="cat in categories"
          :key="String(cat.value)"
          @click="emit('select', cat.value)"
          class="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs tracking-widest uppercase transition-all duration-300"
          :class="activeCategory === cat.value
            ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff2d78] text-white shadow-[0_0_20px_rgba(255,107,0,0.4)] scale-105'
            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'"
        >
          <span class="text-base">{{ cat.icon }}</span>
          <span class="whitespace-nowrap">{{ cat.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ activeCategory: { type: String, default: null } })
const emit = defineEmits(['select'])

const categories = [
  { value: null, label: 'All', icon: '🛍️' },
  { value: 'T-Shirts', label: 'T-Shirts', icon: '👕' },
  { value: 'Shirts', label: 'Shirts', icon: '👔' },
  { value: 'Joggers', label: 'Joggers', icon: '👖' },
  { value: 'Shorts', label: 'Shorts', icon: '🩳' },
  { value: 'Hoodies', label: 'Hoodies', icon: '🧥' },
  { value: 'Jackets', label: 'Jackets', icon: '🧤' },
  { value: 'Sneakers', label: 'Sneakers', icon: '👟' }
]
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
