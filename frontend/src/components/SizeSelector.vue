<template>
  <div>
    <div class="flex items-center gap-2 mb-2">
      <label class="text-sm font-bold text-gray-900">SELECT SIZE:</label>
      <button v-if="showSizeGuide" @click="$emit('showGuide')" class="text-xs text-[#ff6b00] hover:underline">
        Size Guide
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="size in sizes"
        :key="size"
        @click="selectSize(size)"
        :disabled="outOfStockSizes.includes(size)"
        class="px-4 py-2 border-2 rounded font-medium transition-all"
        :class="{
          'bg-black text-white border-black': selectedSize === size,
          'border-gray-300 text-gray-900 hover:border-black': selectedSize !== size && !outOfStockSizes.includes(size),
          'opacity-40 line-through cursor-not-allowed': outOfStockSizes.includes(size)
        }"
      >
        {{ size }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  sizes: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: null
  },
  outOfStockSizes: {
    type: Array,
    default: () => []
  },
  showSizeGuide: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'showGuide'])

const selectedSize = ref(props.modelValue)

const selectSize = (size) => {
  if (props.outOfStockSizes.includes(size)) return
  selectedSize.value = size
  emit('update:modelValue', size)
}
</script>
