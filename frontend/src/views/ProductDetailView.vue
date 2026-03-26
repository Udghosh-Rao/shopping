<template>
  <div>
    <Navbar />

    <div class="container mx-auto px-4 py-8" v-if="product">
      <div class="grid lg:grid-cols-11 gap-8">
        <div class="lg:col-span-6 lg:sticky lg:top-24 self-start">
          <div class="relative rounded-2xl overflow-hidden shadow-xl bg-gray-100">
            <img :src="activeImage" :alt="product.name" class="w-full aspect-[4/5] object-cover hover:scale-110 transition-transform duration-500" />
            <span v-if="product.badge" :class="['badge absolute top-4 left-4', badgeClass]">{{ product.badge }}</span>
            <button class="absolute top-4 right-4 bg-white/90 rounded-full w-10 h-10" @click="shareProduct">↗</button>
          </div>
          <div class="grid grid-cols-4 gap-3 mt-3">
            <button v-for="img in gallery" :key="img" class="rounded-xl overflow-hidden border-2" :class="activeImage === img ? 'border-orange-500' : 'border-transparent'" @click="activeImage = img">
              <img :src="img" class="aspect-square object-cover w-full" alt="thumbnail" />
            </button>
          </div>
        </div>

        <div class="lg:col-span-5">
          <p class="text-xs text-gray-500">Home > {{ product.category }} > {{ product.name }}</p>
          <span v-if="product.badge" class="inline-block mt-2 badge" :class="badgeClass">{{ product.badge }}</span>
          <h1 class="text-5xl mt-2 leading-tight" style="font-family: var(--font-display)">{{ product.name }}</h1>

          <button class="mt-3 text-sm flex items-center gap-2" @click="scrollToReviews">
            <span class="text-orange-400">★★★★☆</span>
            <span>{{ product.rating }} · {{ product.reviews }} reviews · VERIFIED PURCHASE</span>
          </button>

          <div class="mt-5">
            <div class="flex items-end gap-3">
              <span class="text-4xl font-black">₹{{ product.price }}</span>
              <span v-if="product.original_price" class="line-through text-gray-400">₹{{ product.original_price }}</span>
              <span v-if="discountPercent" class="px-2 py-1 rounded-full bg-green-100 text-green-600 text-xs font-bold">{{ discountPercent }}% OFF</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          <hr class="my-6" />

          <div>
            <p class="text-sm font-semibold">COLOR: {{ selectedColor }}</p>
            <div class="mt-2 flex gap-2">
              <button
                v-for="color in colors"
                :key="color"
                class="w-8 h-8 rounded-full border-2"
                :style="{ background: colorToHex(color) }"
                :class="selectedColor === color ? 'border-orange-500 ring-2 ring-orange-300' : 'border-white shadow'"
                @click="selectedColor = color"
              ></button>
            </div>
          </div>

          <div class="mt-6">
            <div class="flex justify-between text-sm font-semibold">
              <p>SIZE: {{ selectedSize }}</p>
              <button class="text-orange-500" @click="sizeGuideOpen = true">SIZE GUIDE →</button>
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="size in sizes"
                :key="size"
                class="px-4 py-2 border-2 rounded-xl font-bold text-sm"
                :class="selectedSize === size ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-orange-500'"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <div class="mt-6">
            <p class="text-sm font-semibold">QUANTITY</p>
            <div class="flex items-center gap-3 mt-2">
              <button class="w-9 h-9 rounded-full border" @click="quantity = Math.max(1, quantity - 1)">−</button>
              <span class="font-semibold">{{ quantity }}</span>
              <button class="w-9 h-9 rounded-full border" @click="quantity = Math.min(10, quantity + 1)">+</button>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-12 gap-3">
            <button
              class="col-span-12 sm:col-span-5 btn-primary justify-center"
              :class="addedToCart ? 'bg-green-500 hover:bg-green-600 animate-pulse-btn' : ''"
              @click="addToCart"
            >
              {{ addedToCart ? '✓ ADDED!' : '🛒 ADD TO CART' }}
            </button>
            <button class="col-span-12 sm:col-span-5 btn-dark justify-center" @click="buyNow">⚡ BUY NOW</button>
            <button class="col-span-12 sm:col-span-2 border-2 rounded-full" @click="toggleWishlist">❤️</button>
          </div>

          <div class="mt-6 border rounded-2xl p-4 bg-gray-50">
            <p class="text-sm font-semibold mb-2">Delivery</p>
            <div class="flex gap-2">
              <input v-model="pincode" class="input-field !py-2" placeholder="Enter Pincode" />
              <button class="btn-dark !px-4 !py-2" @click="checkPincode">CHECK</button>
            </div>
            <p v-if="deliveryMessage" class="text-sm mt-2 text-green-600">{{ deliveryMessage }}</p>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-2 text-sm">
            <div class="rounded-xl border p-3">✅ Official Licensed Product</div>
            <div class="rounded-xl border p-3">🚚 Free Delivery above ₹499</div>
            <div class="rounded-xl border p-3">🔄 Easy 15-Day Returns</div>
            <div class="rounded-xl border p-3">💳 Cash on Delivery</div>
          </div>

          <div class="mt-6 space-y-3">
            <details class="border rounded-xl p-3" open>
              <summary class="font-semibold cursor-pointer">PRODUCT DESCRIPTION</summary>
              <p class="text-sm text-gray-600 mt-2">{{ product.description }}</p>
            </details>
            <details class="border rounded-xl p-3">
              <summary class="font-semibold cursor-pointer">FABRIC & CARE</summary>
              <p class="text-sm text-gray-600 mt-2">100% Combed Cotton | Machine Wash Cold | Do not bleach</p>
            </details>
            <details class="border rounded-xl p-3">
              <summary class="font-semibold cursor-pointer">SIZE & FIT</summary>
              <table class="w-full mt-2 text-xs">
                <thead><tr class="text-left"><th>Size</th><th>Chest</th><th>Length</th></tr></thead>
                <tbody>
                  <tr v-for="row in sizeChart" :key="row.size"><td>{{ row.size }}</td><td>{{ row.chest }}</td><td>{{ row.length }}</td></tr>
                </tbody>
              </table>
            </details>
          </div>
        </div>
      </div>

      <section class="mt-14">
        <h2 class="text-5xl" style="font-family: var(--font-display)">YOU MAY ALSO LIKE</h2>
        <div class="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ProductCard v-for="item in related" :key="item.id" :product="item" />
        </div>
      </section>

      <section id="reviews" class="mt-14 bg-gray-50 rounded-2xl p-6">
        <h2 class="text-5xl" style="font-family: var(--font-display)">REVIEWS</h2>
        <div class="mt-4 grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl p-4" v-for="r in sampleReviews" :key="r.name">
            <p class="text-orange-500">★★★★★</p>
            <p class="text-sm mt-2">{{ r.text }}</p>
            <p class="mt-2 text-sm font-semibold">{{ r.name }}</p>
          </div>
        </div>
      </section>
    </div>

    <div v-if="product" class="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-[0_-6px_24px_rgba(0,0,0,0.08)] z-40 p-3 flex items-center gap-2">
      <p class="font-black text-lg">₹{{ product.price }}</p>
      <button class="btn-primary !py-2 !px-4 flex-1 justify-center" @click="addToCart">ADD TO CART</button>
      <button class="btn-dark !py-2 !px-4 flex-1 justify-center" @click="buyNow">BUY NOW</button>
    </div>

    <Transition name="fade">
      <div v-if="sizeGuideOpen" class="fixed inset-0 bg-black/50 z-50 grid place-items-center p-4" @click.self="sizeGuideOpen = false">
        <div class="bg-white rounded-2xl p-5 max-w-md w-full">
          <div class="flex justify-between items-center"><h3 class="font-bold">Size Guide</h3><button @click="sizeGuideOpen = false">✕</button></div>
          <table class="w-full mt-3 text-sm">
            <thead><tr><th class="text-left">Size</th><th class="text-left">Chest</th><th class="text-left">Length</th></tr></thead>
            <tbody>
              <tr v-for="row in sizeChart" :key="row.size"><td>{{ row.size }}</td><td>{{ row.chest }}</td><td>{{ row.length }}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Transition>

    <Footer />
    <Toast />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import Navbar from '../components/Navbar.vue'
import ProductCard from '../components/ProductCard.vue'
import Toast from '../components/Toast.vue'
import api from '../services/api'
import { useCartStore } from '../stores/cartStore'
import { useToastStore } from '../stores/toastStore'
import { useWishlistStore } from '../stores/wishlistStore'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const toastStore = useToastStore()
const wishlistStore = useWishlistStore()

const product = ref(null)
const related = ref([])
const activeImage = ref('')
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const addedToCart = ref(false)
const pincode = ref('')
const deliveryMessage = ref('')
const sizeGuideOpen = ref(false)

const sampleReviews = [
  { name: 'Riya S.', text: 'The fit and quality are incredible. Highly recommend.' },
  { name: 'Arjun K.', text: 'Looks exactly like the photos. Loved the print quality.' }
]

const sizeChart = [
  { size: 'XS', chest: '36', length: '25' },
  { size: 'S', chest: '38', length: '26' },
  { size: 'M', chest: '40', length: '27' },
  { size: 'L', chest: '42', length: '28' },
  { size: 'XL', chest: '44', length: '29' },
  { size: 'XXL', chest: '46', length: '30' }
]

const gallery = computed(() => {
  if (!product.value) return []
  const base = [product.value.image_url, product.value.image_url_hover || product.value.image_url]
  while (base.length < 4) base.push(product.value.image_url)
  return base.slice(0, 4)
})

const colors = computed(() => (product.value?.colors?.length ? product.value.colors : ['Black', 'White']))
const sizes = computed(() => (product.value?.sizes?.length ? product.value.sizes : ['S', 'M', 'L', 'XL']))

const discountPercent = computed(() => {
  if (!product.value?.original_price) return 0
  return Math.round(((product.value.original_price - product.value.price) / product.value.original_price) * 100)
})

const badgeClass = computed(() => {
  const badge = (product.value?.badge || '').toUpperCase()
  if (badge === 'NEW') return 'badge-new'
  if (badge === 'SALE') return 'badge-sale'
  if (badge === 'HOT') return 'badge-hot'
  if (badge === 'BESTSELLER') return 'badge-best'
  return 'badge-limited'
})

function colorToHex(color) {
  const c = color.toLowerCase()
  if (c.includes('black')) return '#111827'
  if (c.includes('white')) return '#f8fafc'
  if (c.includes('blue') || c.includes('navy')) return '#1e3a8a'
  if (c.includes('green')) return '#166534'
  if (c.includes('red')) return '#dc2626'
  return '#9ca3af'
}

function scrollToReviews() {
  document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
}

async function loadProduct() {
  const { data } = await api.get(`/products/${route.params.id}`)
  product.value = data
  activeImage.value = data.image_url
  selectedColor.value = colors.value[0]
  selectedSize.value = sizes.value[0]

  const { data: relatedData } = await api.get(`/products/related/${route.params.id}`)
  related.value = relatedData

  const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
  const updated = [product.value.id, ...stored.filter((i) => i !== product.value.id)].slice(0, 6)
  localStorage.setItem('recentlyViewed', JSON.stringify(updated))
}

function addToCart() {
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem(product.value, selectedSize.value, selectedColor.value)
  }
  toastStore.success('✅ Added to cart!')
  addedToCart.value = true
  setTimeout(() => {
    addedToCart.value = false
  }, 1500)
}

function buyNow() {
  addToCart()
  router.push('/checkout')
}

function toggleWishlist() {
  const already = wishlistStore.isWishlisted(product.value.id)
  wishlistStore.toggle(product.value.id)
  toastStore.info(already ? 'Removed from wishlist' : '❤️ Added to wishlist')
}

async function checkPincode() {
  try {
    const { data } = await api.get('/delivery/check', { params: { pincode: pincode.value } })
    if (data.available) deliveryMessage.value = `✅ Delivery in ${data.days} days to ${pincode.value}`
  } catch (_e) {
    deliveryMessage.value = '❌ Delivery not available for this pincode'
  }
}

async function shareProduct() {
  if (navigator.share) {
    await navigator.share({ title: product.value.name, url: window.location.href })
  } else {
    await navigator.clipboard.writeText(window.location.href)
    toastStore.info('Link copied to clipboard')
  }
}

onMounted(loadProduct)
</script>
