<template>
  <div
    @click="goToProduct"
    class="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
  >
    <!-- Image Container -->
    <div class="relative aspect-[4/5] overflow-hidden bg-gray-100">
      <!-- Main Image -->
      <img
        :src="product.image_url"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
      />
      <!-- Hover Image -->
      <img
        v-if="product.image_url_hover"
        :src="product.image_url_hover"
        :alt="product.name"
        class="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <!-- Badge -->
      <div v-if="product.badge" class="absolute top-2 left-2">
        <span
          class="px-2 py-1 text-xs font-extrabold uppercase rounded"
          :class="{
            'bg-[#2ec4b6] text-white': product.badge === 'NEW',
            'bg-[#e63946] text-white': product.badge === 'SALE',
            'bg-[#ff6b00] text-white': product.badge === 'HOT',
            'bg-[#f4a261] text-white': product.badge === 'BESTSELLER',
            'bg-purple-600 text-white': product.badge === 'LIMITED'
          }"
        >
          {{ product.badge }}
        </span>
      </div>

      <!-- Discount Badge -->
      <div v-if="product.discount_percent > 0" class="absolute top-2 right-2">
        <div class="bg-[#e63946] text-white text-xs font-bold rounded-full w-10 h-10 flex items-center justify-center">
          -{{ product.discount_percent }}%
        </div>
      </div>

      <!-- Wishlist Heart -->
      <button
        @click.stop="toggleWishlist"
        class="absolute top-2 right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        :class="{ 'opacity-100': isWishlisted }"
      >
        <span :class="isWishlisted ? 'text-red-500' : 'text-gray-400'" class="text-xl">
          {{ isWishlisted ? '❤️' : '🤍' }}
        </span>
      </button>

      <!-- Quick Add Overlay -->
      <div class="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <div class="flex gap-1 mb-2 overflow-x-auto">
          <button
            v-for="size in product.sizes.slice(0, 6)"
            :key="size"
            class="px-2 py-1 text-xs border border-white hover:bg-white hover:text-black transition-colors"
          >
            {{ size }}
          </button>
        </div>
        <button
          @click.stop="quickAdd"
          class="w-full bg-[#ff6b00] text-white py-2 text-sm font-bold hover:bg-[#ff8533] transition-colors"
        >
          ADD TO CART
        </button>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-3">
      <h3 class="font-medium text-sm text-gray-900 truncate mb-1">
        {{ product.name }}
      </h3>
      <RatingStars :rating="product.rating" :reviewCount="product.reviews" class="mb-2" />
      <div class="flex items-center gap-2">
        <span class="text-lg font-bold text-gray-900">₹{{ product.price }}</span>
        <span v-if="product.original_price" class="text-sm text-gray-500 line-through">₹{{ product.original_price }}</span>
        <span v-if="product.discount_percent > 0" class="text-sm font-bold text-green-600">({{ product.discount_percent }}% OFF)</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'
import { useToastStore } from '../stores/toastStore'
import RatingStars from './RatingStars.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const toastStore = useToastStore()

const isWishlisted = computed(() => wishlistStore.isWishlisted(props.product.id))

const toggleWishlist = () => {
  wishlistStore.toggle(props.product.id)
  if (isWishlisted.value) {
    toastStore.success('Added to wishlist!')
  } else {
    toastStore.info('Removed from wishlist')
  }
}

const quickAdd = () => {
  const defaultSize = props.product.sizes[0] || null
  const defaultColor = props.product.colors[0] || null
  cartStore.addItem(props.product, defaultSize, defaultColor)
  toastStore.success('✅ Added to cart!')
}

const goToProduct = () => {
  router.push(`/products/${props.product.id}`)
}
</script>
