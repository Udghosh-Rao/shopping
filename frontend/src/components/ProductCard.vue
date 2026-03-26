<template>
  <div class="group flex flex-col h-full cursor-pointer reveal-scale" :style="{ transitionDelay: index * 40 + 'ms' }">
    
    <!-- Image Container -->
    <div class="relative w-full aspect-[4/5] bg-[var(--dark-2)] overflow-hidden rounded-md mb-4 group-hover:shadow-[0_10px_30px_rgba(255,107,0,0.15)] transition-shadow">
      
      <!-- Badge -->
      <div v-if="product.badge" class="absolute top-3 left-3 z-20">
        <span class="bg-black/60 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm">
          {{ product.badge }}
        </span>
      </div>

      <!-- Wishlist -->
      <button 
        class="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-sm transition-all hover:bg-white hover:text-black"
        @click.stop="toggleWishlist"
      >
        <span :class="isWishlisted ? 'text-neon-pink' : ''">{{ isWishlisted ? '♥' : '♡' }}</span>
      </button>

      <!-- Images -->
      <img :src="product.image_url" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
      <img :src="product.image_url_hover || product.image_url" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 transform scale-105 group-hover:scale-100 transition-transform" />
    
      <!-- Quick Add Overlay (Desktop) -->
      <div class="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 bg-gradient-to-t from-black/80 to-transparent flex justify-center hidden sm:flex">
        <button 
          class="w-full bg-white text-black py-3 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-neon-orange hover:text-white transition-colors flex items-center justify-center h-10"
          @click.stop="handleAddToCart"
        >
          <span v-if="cartStatus === 'idle'">+ Quick Add</span>
          <span v-if="cartStatus === 'loading'" class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          <span v-if="cartStatus === 'success'" class="text-green-600">✓ Added</span>
        </button>
      </div>
    </div>

    <!-- Details -->
    <div class="flex flex-col flex-1">
      <div class="flex justify-between items-start gap-4 mb-1">
        <h3 class="font-bold text-sm text-white group-hover:text-neon-orange transition-colors leading-tight line-clamp-2">{{ product.name }}</h3>
        <p class="font-display tracking-widest text-lg text-white">${{ product.price }}</p>
      </div>
      <p class="text-xs font-bold text-gray-500 tracking-widest uppercase">{{ product.category || 'Apparel' }}</p>
      
      <!-- Mobile Add To Cart -->
      <button 
        class="mt-4 w-full border border-white/10 py-2 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-white/10 transition-colors sm:hidden flex items-center justify-center h-10"
        @click.stop="handleAddToCart"
      >
        <span v-if="cartStatus === 'idle'">Add To Cart</span>
        <span v-if="cartStatus === 'loading'" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        <span v-if="cartStatus === 'success'" class="text-neon-green">✓ Added</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { addToCart } from '../composables/useCart'

const props = defineProps({
  product: { type: Object, required: true },
  index: { type: Number, default: 0 }
})

const isWishlisted = ref(false)
const toggleWishlist = () => isWishlisted.value = !isWishlisted.value

const cartStatus = ref('idle')

const handleAddToCart = (e) => {
  if (cartStatus.value !== 'idle') return
  cartStatus.value = 'loading'
  
  setTimeout(() => {
    cartStatus.value = 'success'
    addToCart({ ...props.product, size: props.product.size || 'M', quantity: 1 })
    
    setTimeout(() => {
      cartStatus.value = 'idle'
    }, 1500)
  }, 500)
}
</script>
