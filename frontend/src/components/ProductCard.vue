<template>
  <div class="card group relative cursor-pointer" @click="goToProduct">
    <div class="relative overflow-hidden bg-gray-100" style="aspect-ratio: 4/5">
      <img :src="product.image_url" :alt="product.name" class="w-full h-full object-cover transition-all duration-500 group-hover:opacity-0 absolute inset-0" />
      <img :src="product.image_url_hover || product.image_url" :alt="product.name" class="w-full h-full object-cover transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105" />

      <span
        v-if="product.badge"
        :class="[
          'absolute top-3 left-3 z-10 badge',
          badgeClass
        ]"
      >
        {{ product.badge }}
      </span>

      <span
        v-if="discountPercent > 0"
        class="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-black rounded-full w-10 h-10 flex items-center justify-center"
      >
        -{{ discountPercent }}%
      </span>

      <button
        @click.stop="toggleWishlist"
        class="absolute top-12 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow transition-all duration-200 hover:scale-110 hover:bg-white"
      >
        <span :class="isWishlisted ? 'text-red-500' : 'text-gray-400'">{{ isWishlisted ? '❤️' : '🤍' }}</span>
      </button>

      <div class="absolute bottom-0 left-0 right-0 bg-black/85 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3 z-10">
        <div class="flex gap-1.5 justify-center mb-2 flex-wrap">
          <button
            v-for="size in sizesArray"
            :key="size"
            @click.stop="selectSize(size)"
            :class="[
              'text-xs font-bold px-2.5 py-1 rounded-md transition-all duration-150',
              selectedSize === size ? 'bg-orange-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'
            ]"
          >
            {{ size }}
          </button>
        </div>
        <button
          @click.stop="addToCart"
          :class="[
            'w-full py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200',
            addedToCart ? 'bg-green-500 text-white animate-pulse-btn' : 'bg-orange-500 hover:bg-orange-600 text-white'
          ]"
        >
          {{ addedToCart ? '✓ ADDED!' : 'ADD TO CART' }}
        </button>
      </div>
    </div>

    <div class="p-3">
      <div class="flex items-center gap-1 mb-1">
        <div class="flex">
          <span v-for="i in 5" :key="i" :class="i <= Math.round(product.rating) ? 'text-orange-400' : 'text-gray-200'" class="text-xs">★</span>
        </div>
        <span class="text-xs text-gray-400">({{ product.reviews }})</span>
      </div>

      <h3 class="font-semibold text-sm text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{{ product.name }}</h3>

      <div class="flex items-center gap-2">
        <span class="font-black text-base text-gray-900">₹{{ product.price }}</span>
        <span v-if="product.original_price" class="text-xs text-gray-400 line-through">₹{{ product.original_price }}</span>
        <span v-if="discountPercent > 0" class="text-xs font-bold text-green-500">{{ discountPercent }}% off</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useToastStore } from '../stores/toastStore'
import { useWishlistStore } from '../stores/wishlistStore'

const props = defineProps({ product: { type: Object, required: true } })

const router = useRouter()
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToastStore()

const selectedSize = ref('')
const addedToCart = ref(false)

const sizesArray = computed(() => {
  if (Array.isArray(props.product.sizes) && props.product.sizes.length) return props.product.sizes
  if (typeof props.product.sizes === 'string' && props.product.sizes.length) return props.product.sizes.split(',')
  return ['S', 'M', 'L', 'XL']
})

const discountPercent = computed(() => {
  if (!props.product.original_price) return 0
  return Math.round(((props.product.original_price - props.product.price) / props.product.original_price) * 100)
})

const isWishlisted = computed(() => wishlist.isWishlisted(props.product.id))

const badgeClass = computed(() => {
  const badge = (props.product.badge || '').toUpperCase()
  if (badge === 'NEW') return 'badge-new'
  if (badge === 'SALE') return 'badge-sale'
  if (badge === 'HOT') return 'badge-hot'
  if (badge === 'BESTSELLER') return 'badge-best'
  return 'badge-limited'
})

function goToProduct() {
  router.push(`/products/${props.product.id}`)
}

function selectSize(size) {
  selectedSize.value = size
}

function addToCart() {
  if (!selectedSize.value) selectedSize.value = sizesArray.value[0]
  const color = Array.isArray(props.product.colors) && props.product.colors[0] ? props.product.colors[0] : 'Default'
  cart.addItem(props.product, selectedSize.value, color)
  toast.success(`✅ ${props.product.name} added to cart!`)
  addedToCart.value = true
  setTimeout(() => {
    addedToCart.value = false
  }, 1500)
}

function toggleWishlist() {
  const already = isWishlisted.value
  wishlist.toggle(props.product.id)
  toast.info(already ? 'Removed from wishlist' : '❤️ Added to wishlist')
}
</script>
