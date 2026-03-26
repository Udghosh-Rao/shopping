<template>
  <main class="bg-[var(--black)] min-h-screen text-white pt-24 pb-32 relative">
    <div class="container mx-auto px-6 relative z-10">
      
      <!-- Breadcrumb -->
      <nav class="text-xs font-bold tracking-widest uppercase text-gray-500 mb-8 flex gap-2">
        <RouterLink to="/" class="hover:text-neon-orange transition-colors">HOME</RouterLink>
        <span>/</span>
        <RouterLink to='/products' class="hover:text-neon-orange transition-colors">SHOP</RouterLink>
        <span>/</span>
        <span class="text-white">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        <!-- Image Section -->
        <div class="flex flex-col gap-6">
          <!-- Main Image -->
          <div 
            class="relative w-full aspect-[4/5] bg-white/5 rounded-[2rem] overflow-hidden cursor-zoom-in group border border-white/10"
            @click="lightboxOpen = true"
          >
            <img 
              :src="activeImage" 
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]" 
            />
          </div>

          <!-- Thumbnails -->
          <div class="flex gap-4 overflow-x-auto snap-x hide-scrollbar pb-2">
            <button 
              v-for="(img, idx) in product.images" 
              :key="idx"
              @click="activeImage = img"
              class="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden snap-start transition-all duration-300 relative border-2"
              :class="activeImage === img ? 'border-neon-orange shadow-[0_0_15px_rgba(255,107,0,0.5)] scale-105' : 'border-transparent opacity-50 hover:opacity-100 bg-white/5'"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Info Section -->
        <div class="flex flex-col">
          <div class="mb-4">
            <span class="badge-neon badge-hot px-3 py-1 mr-3">{{ product.badge }}</span>
            <span class="text-xs font-bold tracking-widest text-neon-cyan uppercase">★ 4.9 (128 REVIEWS)</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-display font-black leading-none mb-6 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] text-transparent bg-clip-text bg-[var(--grad-neon)]" style="background-image: var(--grad-neon)">
            {{ product.name }}
          </h1>

          <!-- Animated Price -->
          <div class="text-4xl md:text-5xl font-display font-bold text-neon-orange mb-8 flex items-end gap-3">
            <span>$<span ref="priceEl">{{ animatedPrice }}</span></span>
            <span class="text-xl text-gray-600 line-through mb-1">${{ (product.price * 1.4).toFixed(2) }}</span>
          </div>

          <p class="text-gray-400 text-lg leading-relaxed mb-10 font-medium max-w-lg">
            {{ product.description }}
          </p>

          <hr class="border-white/10 mb-8" />

          <!-- Sizes -->
          <div class="mb-10">
            <div class="flex justify-between items-center mb-4 max-w-md">
              <span class="font-bold tracking-widest uppercase text-sm">SELECT SIZE</span>
              <button class="text-xs font-bold text-gray-500 hover:text-white underline underline-offset-4 uppercase tracking-widest transition-colors">SIZE GUIDE</button>
            </div>
            <div class="flex flex-wrap gap-4">
              <button 
                v-for="s in ['S', 'M', 'L', 'XL', 'XXL']" 
                :key="s"
                @click="selectedSize = s"
                class="w-14 h-14 rounded-full font-bold flex items-center justify-center transition-all duration-300 border border-white/10"
                :class="selectedSize === s ? 'bg-gradient-to-tr from-neon-orange to-neon-pink text-white shadow-[0_0_20px_rgba(255,107,0,0.5)] scale-110 !border-transparent' : 'glass hover:scale-110 hover:border-neon-orange hover:shadow-[0_0_15px_rgba(255,107,0,0.3)]'"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div class="mb-10">
            <span class="font-bold tracking-widest uppercase text-sm block mb-4">QUANTITY</span>
            <div class="flex items-center gap-4">
              <button 
                @click="quantity > 1 && quantity--"
                class="w-12 h-12 rounded-full glass flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-90 border border-white/10 hover:border-white/30"
              >-</button>
              <span class="font-display text-3xl w-12 text-center">{{ quantity }}</span>
              <button 
                @click="quantity < 10 && quantity++"
                class="w-12 h-12 rounded-full glass flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95 border border-white/10 hover:border-white/30"
              >+</button>
            </div>
          </div>

          <!-- Add to Cart (Magnetic) -->
          <div class="max-w-md">
            <button 
              ref="cartBtn"
              class="w-full btn-glow-orange py-5 text-xl tracking-widest uppercase font-black relative overflow-hidden flex items-center justify-center h-20"
              @mousemove="handleMagneticMove"
              @mouseleave="resetMagneticMove"
              @click="handleAddToCart"
              :style="{ transform: magneticTransform }"
            >
              <span class="relative z-10 block pointer-events-none transition-transform duration-300 w-full" :style="{ transform: magneticTextTransform }">
                <span v-if="cartStatus === 'idle'">ADD TO CART — ${{ (product.price * quantity).toFixed(2) }}</span>
                <span v-if="cartStatus === 'loading'" class="flex items-center justify-center h-full"><span class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span></span>
                <span v-if="cartStatus === 'success'" class="anim-bounceIn flex items-center justify-center gap-2">✓ ADDED TO CART</span>
              </span>
              <!-- Ripple hook -->
              <span class="absolute inset-0 z-0 pointer-events-none opacity-50 block" ref="btnContent"></span>
            </button>
          </div>

          <!-- Perks -->
          <div class="mt-8 grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest text-gray-400 max-w-md">
            <div class="flex items-center gap-2"><span>📦</span> FREE SHIPPING OVER $100</div>
            <div class="flex items-center gap-2"><span>🔄</span> 30-DAY RETURNS</div>
            <div class="flex items-center gap-2"><span>🛡️</span> SECURE CHECKOUT</div>
            <div class="flex items-center gap-2"><span>✨</span> PREMIUM QUALITY</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Transition name="fade">
      <div 
        v-if="lightboxOpen" 
        class="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center cursor-zoom-out"
        @click="lightboxOpen = false"
      >
        <button class="absolute top-8 right-8 text-white text-6xl font-light hover:text-neon-orange transition-colors z-50">×</button>
        <img :src="activeImage" class="max-w-[90vw] max-h-[90vh] object-contain p-4 cursor-default anim-bounceIn shadow-[0_0_100px_rgba(255,107,0,0.2)] rounded-2xl" @click.stop />
      </div>
    </Transition>

    <!-- Sticky Mobile Bar -->
    <Transition name="slideUp">
      <div 
        v-if="showMobileBar" 
         class="fixed bottom-0 left-0 w-full z-40 p-4 lg:hidden"
      >
        <div class="glass-light dark:glass-card !bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-between p-4 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] rounded-2xl">
          <div>
            <div class="font-bold text-sm line-clamp-1 uppercase tracking-widest">{{ product.name }}</div>
            <div class="text-neon-orange font-bold font-display text-xl">${{ product.price }}</div>
          </div>
          <button class="btn-glow-orange py-3 px-6 text-sm whitespace-nowrap" @click="toggleCart(true)">
            VIEW CART
          </button>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { addToCart, toggleCart } from '../composables/useCart'
import { useCountUp } from '../composables/useCountUp'
import { useRipple } from '../composables/useRipple'

// MOCK DATA
const product = {
  id: 1,
  name: 'NEON DEMON HOODIE',
  price: 85,
  badge: '🔥 HOT DROP',
  description: 'Heavyweight 500gsm cotton fleece. Boxy fit with dropped shoulders. High-density puff print graphic on the back with neon glow effect ink. Limited run of 500 pieces.',
  images: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578587018452-892bace01140?q=80&w=800&auto=format&fit=crop'
  ]
}

const activeImage = ref(product.images[0])
const selectedSize = ref('L')
const quantity = ref(1)

// Price Counter
const { count: animatedPrice, startCount: sp } = useCountUp()
onMounted(() => {
  nextTick(() => sp(product.price, 600)) // fast count
})

// Lightbox
const lightboxOpen = ref(false)
const handleEsc = (e) => {
  if (e.key === 'Escape') lightboxOpen.value = false
}
onMounted(() => window.addEventListener('keydown', handleEsc))
onUnmounted(() => window.removeEventListener('keydown', handleEsc))

// Mobile Sticky Bar
const showMobileBar = ref(false)
onMounted(() => {
  setTimeout(() => showMobileBar.value = true, 1000) // Slide up after mount
})

// Magnetic Button Effect & Ripple
const { createRipple } = useRipple()
const cartBtn = ref(null)
const magneticTransform = ref('')
const magneticTextTransform = ref('')
const cartStatus = ref('idle')

const handleMagneticMove = (e) => {
  if (!cartBtn.value) return
  const rect = cartBtn.value.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  // Move button slightly
  magneticTransform.value = `translate(${x * 0.15}px, ${y * 0.25}px)`
  // Move text more for parallax effect
  magneticTextTransform.value = `translate(${x * 0.1}px, ${y * 0.1}px)`
}

const resetMagneticMove = () => {
  magneticTransform.value = 'translate(0, 0)'
  magneticTransform.value += ' transition: transform 0.3s ease-out'
  setTimeout(() => {
    magneticTransform.value = 'translate(0, 0)' // remove transition for seamless mouse move later
  }, 300)
  magneticTextTransform.value = 'translate(0, 0)'
}

const handleAddToCart = (e) => {
  if (cartStatus.value !== 'idle') return
  createRipple(e)
  cartStatus.value = 'loading'
  
  setTimeout(() => {
    cartStatus.value = 'success'
    addToCart({ ...product, size: selectedSize.value, quantity: quantity.value })
    setTimeout(() => {
      cartStatus.value = 'idle'
    }, 2000)
  }, 600)
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.slideUp-enter-active {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.slideUp-leave-active {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards;
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
