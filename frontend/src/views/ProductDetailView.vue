<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <LoadingSpinner v-if="loading" :fullPage="true" />

      <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Left: Images -->
        <div class="space-y-4">
          <div class="relative aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
            <img :src="currentImage" :alt="product.name" class="w-full h-full object-cover" />
            <div v-if="product.badge" class="absolute top-4 left-4 px-3 py-1 rounded text-xs font-extrabold uppercase"
              :class="{
                'bg-[#2ec4b6] text-white': product.badge === 'NEW',
                'bg-[#e63946] text-white': product.badge === 'SALE',
                'bg-[#ff6b00] text-white': product.badge === 'HOT',
                'bg-[#f4a261] text-white': product.badge === 'BESTSELLER'
              }">
              {{ product.badge }}
            </div>
          </div>
          <div class="flex gap-3">
            <img @click="currentImage = product.image_url" :src="product.image_url" class="w-20 h-20 object-cover rounded cursor-pointer border-2" :class="currentImage === product.image_url ? 'border-black' : 'border-gray-200'" />
            <img v-if="product.image_url_hover" @click="currentImage = product.image_url_hover" :src="product.image_url_hover" class="w-20 h-20 object-cover rounded cursor-pointer border-2" :class="currentImage === product.image_url_hover ? 'border-black' : 'border-gray-200'" />
          </div>
        </div>

        <!-- Right: Details -->
        <div>
          <nav class="text-sm text-gray-500 mb-4">
            <RouterLink to="/" class="hover:text-black">Home</RouterLink> >
            <RouterLink :to="`/products?category=${product.category}`" class="hover:text-black">{{ product.category }}</RouterLink> >
            {{ product.name }}
          </nav>

          <h1 class="text-3xl font-black mb-2">{{ product.name }}</h1>
          <RatingStars :rating="product.rating" :reviewCount="product.reviews" class="mb-4" />

          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl font-bold">₹{{ product.price }}</span>
            <span v-if="product.original_price" class="text-xl text-gray-500 line-through">₹{{ product.original_price }}</span>
            <span v-if="product.discount_percent" class="px-2 py-1 bg-green-100 text-green-700 text-sm font-bold rounded">({{ product.discount_percent }}% OFF)</span>
          </div>

          <!-- Color Selector -->
          <div v-if="product.colors.length > 0" class="mb-6">
            <label class="text-sm font-bold mb-2 block">SELECT COLOR:</label>
            <div class="flex gap-2">
              <button v-for="color in product.colors" :key="color" @click="selectedColor = color"
                class="px-4 py-2 border-2 rounded font-medium"
                :class="selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'">
                {{ color }}
              </button>
            </div>
          </div>

          <!-- Size Selector -->
          <SizeSelector v-if="product.sizes.length > 0" v-model="selectedSize" :sizes="product.sizes" :outOfStockSizes="[]" class="mb-6" />

          <!-- Quantity -->
          <div class="mb-6">
            <label class="text-sm font-bold mb-2 block">QUANTITY:</label>
            <div class="flex items-center gap-3">
              <button @click="quantity > 1 && quantity--" class="w-10 h-10 border-2 rounded font-bold hover:bg-gray-100">-</button>
              <span class="text-xl font-bold">{{ quantity }}</span>
              <button @click="quantity++" class="w-10 h-10 border-2 rounded font-bold hover:bg-gray-100">+</button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3 mb-6">
            <button @click="addToCart" class="w-full py-4 border-2 border-[#ff6b00] text-[#ff6b00] rounded-lg font-bold hover:bg-[#ff6b00] hover:text-white transition">
              ADD TO CART
            </button>
            <button @click="buyNow" class="w-full py-4 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition">
              BUY NOW
            </button>
            <button @click="toggleWishlist" class="w-full py-4 border-2 rounded-lg font-bold hover:bg-gray-50 transition">
              {{ isWishlisted ? '❤️ IN WISHLIST' : '🤍 ADD TO WISHLIST' }}
            </button>
          </div>

          <!-- Product Highlights -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="space-y-2 text-sm">
              <p>✅ 100% Official Licensed Product</p>
              <p>✅ Free Shipping above ₹499</p>
              <p>✅ Easy 15-Day Returns</p>
              <p>✅ Cash on Delivery Available</p>
            </div>
          </div>

          <!-- Description -->
          <div class="border-t pt-4">
            <h3 class="font-bold mb-2">PRODUCT DESCRIPTION</h3>
            <p class="text-gray-600">{{ product.description }}</p>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-16">
        <h2 class="text-2xl font-black mb-6">YOU MAY ALSO LIKE</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard v-for="prod in relatedProducts" :key="prod.id" :product="prod" />
        </div>
      </div>
    </div>

    <Footer />
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { useToastStore } from '../stores/toastStore'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProductCard from '../components/ProductCard.vue'
import RatingStars from '../components/RatingStars.vue'
import SizeSelector from '../components/SizeSelector.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import Toast from '../components/Toast.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const toastStore = useToastStore()

const product = ref(null)
const relatedProducts = ref([])
const loading = ref(true)
const selectedSize = ref(null)
const selectedColor = ref(null)
const quantity = ref(1)
const currentImage = ref('')

const isWishlisted = computed(() => product.value && wishlistStore.isWishlisted(product.value.id))

const fetchProduct = async () => {
  try {
    loading.value = true
    const { data } = await api.get(`/products/${route.params.id}`)
    product.value = data
    currentImage.value = data.image_url
    selectedSize.value = data.sizes[0] || null
    selectedColor.value = data.colors[0] || null

    // Fetch related products
    const { data: related } = await api.get(`/products/related/${route.params.id}`)
    relatedProducts.value = related
  } catch (error) {
    toastStore.error('Failed to load product')
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (!selectedSize.value) {
    toastStore.error('Please select a size')
    return
  }
  cartStore.addItem(product.value, selectedSize.value, selectedColor.value)
  toastStore.success('✅ Added to cart!')
}

const buyNow = () => {
  addToCart()
  router.push('/cart')
}

const toggleWishlist = () => {
  wishlistStore.toggle(product.value.id)
  toastStore.success(isWishlisted.value ? 'Added to wishlist!' : 'Removed from wishlist')
}

onMounted(() => {
  fetchProduct()
})
</script>
