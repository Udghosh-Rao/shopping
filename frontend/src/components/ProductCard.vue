<template>
  <div
    class="group flex flex-col h-full cursor-pointer reveal-scale"
    :style="{ transitionDelay: index * 40 + 'ms' }"
    @click="goToProduct"
  >
    
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
        class="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-sm transition-all hover:scale-110"
        :class="isWishlisted ? 'bg-pink-500/20 border-pink-500/40' : 'hover:bg-white hover:text-black'"
        @click.stop="toggleWishlist"
      >
        <span :class="isWishlisted ? 'text-red-500' : 'text-white'">
          {{ isWishlisted ? '♥' : '♡' }}
        </span>
      </button>

      <!-- Images -->
      <img :src="product.image_url" :alt="product.name"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
      <img :src="product.image_url_hover || product.image_url" :alt="product.name"
        class="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100" />
    
      <!-- Quick Add Overlay (Desktop) -->
      <div class="absolute bottom-0 left-0 w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 bg-gradient-to-t from-black/90 to-transparent hidden sm:flex">
        <button 
          class="w-full bg-white text-black py-3 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-neon-orange hover:text-white transition-colors flex items-center justify-center h-10"
          @click.stop="handleAddToCart"
        >
          <span v-if="cartStatus === 'idle'">+ QUICK ADD</span>
          <span v-if="cartStatus === 'loading'" class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          <span v-if="cartStatus === 'success'" class="text-green-600 font-black">✓ ADDED</span>
        </button>
      </div>
    </div>

    <!-- Details -->
    <div class="flex flex-col flex-1">
      <div class="flex justify-between items-start gap-3 mb-1">
        <h3 class="font-bold text-sm text-white group-hover:text-neon-orange transition-colors leading-tight line-clamp-2">{{ product.name }}</h3>
        <div class="text-right flex-shrink-0">
          <p class="font-display tracking-widest text-lg text-white">₹{{ product.price }}</p>
          <p v-if="product.original_price && product.original_price > product.price"
            class="text-xs text-gray-600 line-through">₹{{ product.original_price }}</p>
        </div>
      </div>
      <p class="text-xs font-bold text-gray-600 tracking-widest uppercase">{{ product.category }}</p>
      
      <!-- Mobile Add To Cart -->
      <button 
        class="mt-3 w-full border border-white/10 py-2.5 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-white/10 transition-colors sm:hidden flex items-center justify-center h-10"
        @click.stop="handleAddToCart"
      >
        <span v-if="cartStatus === 'idle'">ADD TO CART</span>
        <span v-if="cartStatus === 'loading'" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        <span v-if="cartStatus === 'success'" class="text-green-400 font-black">✓ ADDED</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { toggleCart } from '../composables/useCart'

const props = defineProps({
  product: { type: Object, required: true },
  index: { type: Number, default: 0 }
})

const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const isWishlisted = computed(() => wishlistStore.isWishlisted(props.product.id))
const toggleWishlist = () => wishlistStore.toggle(props.product.id)
const goToProduct = () => router.push(`/products/${props.product.id}`)

const cartStatus = ref('idle')

const handleAddToCart = () => {
  if (cartStatus.value !== 'idle') return
  cartStatus.value = 'loading'
  
  setTimeout(() => {
    cartStore.addItem(props.product, (props.product.sizes && props.product.sizes[0]) || 'M', (props.product.colors && props.product.colors[0]) || null)
    cartStatus.value = 'success'
    toggleCart(true)
    setTimeout(() => {
      cartStatus.value = 'idle'
    }, 1500)
  }, 400)
}
</script>
