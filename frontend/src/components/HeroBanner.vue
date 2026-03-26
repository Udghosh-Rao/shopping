<template>
  <section
    ref="heroRef"
    class="relative overflow-hidden"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
  >
    <div
      v-for="(slide, index) in slides"
      :key="slide.id"
      v-show="activeIndex === index"
      class="min-h-[78vh] text-white"
      :style="{ background: slide.bg }"
    >
      <div class="container mx-auto px-4 py-14 lg:py-20 grid lg:grid-cols-5 gap-8 items-center">
        <div class="lg:col-span-3">
          <p class="inline-flex items-center border border-orange-500 text-orange-300 rounded-full px-4 py-1 text-xs tracking-[0.18em] animate-fade-up">{{ slide.tag }}</p>
          <h1 class="mt-4 leading-none animate-fade-up">
            <span class="block text-5xl sm:text-7xl">{{ slide.title1 }}</span>
            <span class="block text-6xl sm:text-8xl bg-gradient-to-r from-orange-300 to-orange-600 text-transparent bg-clip-text">{{ slide.title2 }}</span>
          </h1>
          <p class="mt-5 text-gray-300 max-w-2xl animate-fade-up" style="animation-delay:200ms">{{ slide.subtitle }}</p>
          <p class="mt-4 text-xs text-gray-400 animate-fade-up" style="animation-delay:250ms">6M+ Customers · 2000+ Designs · 500+ Licensed</p>
          <div class="mt-8 flex flex-wrap gap-3 animate-fade-up" style="animation-delay:400ms">
            <RouterLink :to="slide.ctaLink" class="btn-primary">{{ slide.ctaText }} →</RouterLink>
            <RouterLink to="/products?badge=NEW" class="btn-outline">NEW DROPS</RouterLink>
          </div>
        </div>

        <div class="lg:col-span-2 relative h-[340px] sm:h-[420px] animate-fade-in" style="animation-delay:300ms">
          <div class="absolute right-0 top-4 w-44 sm:w-56 h-56 sm:h-72 rounded-2xl overflow-hidden shadow-2xl rotate-6">
            <img :src="slide.images[0]" class="w-full h-full object-cover" alt="Product collage" />
          </div>
          <div class="absolute left-4 top-16 w-40 sm:w-52 h-52 sm:h-64 rounded-2xl overflow-hidden shadow-2xl -rotate-6">
            <img :src="slide.images[1]" class="w-full h-full object-cover" alt="Product collage" />
          </div>
          <div class="absolute left-1/3 bottom-0 w-40 sm:w-52 h-52 sm:h-64 rounded-2xl overflow-hidden shadow-2xl rotate-3">
            <img :src="slide.images[2]" class="w-full h-full object-cover" alt="Product collage" />
          </div>
          <span class="absolute left-5 top-2 text-2xl animate-floaty">✨</span>
          <span class="absolute right-8 bottom-10 text-2xl animate-floaty" style="animation-delay:1s">⭐</span>
        </div>
      </div>
    </div>

    <button @click="prev" class="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white">←</button>
    <button @click="next" class="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white">→</button>

    <div class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, i) in slides"
        :key="i"
        @click="activeIndex = i"
        :class="['w-3 h-3 rounded-full', activeIndex === i ? 'bg-orange-500' : 'bg-white/40']"
      />
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useSwipe } from '@vueuse/core'

const slides = [
  {
    id: 1,
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a2e 50%, #16213e 100%)',
    tag: '🔥 SUMMER 2026 COLLECTION',
    title1: 'WEAR YOUR',
    title2: 'FANDOM',
    subtitle: '500+ licensed pop culture tees, sneakers & more',
    ctaText: 'SHOP NOW',
    ctaLink: '/products',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 100%)',
    tag: '🔥 ANIME COLLECTION',
    title1: 'UNLEASH THE',
    title2: 'OTAKU IN YOU',
    subtitle: 'From shonen legends to cult classics — wear every arc.',
    ctaText: 'SHOP ANIME',
    ctaLink: '/products?subcategory=Anime',
    images: [
      'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=700&q=80'
    ]
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg, #0d1f1a 0%, #064e3b 100%)',
    tag: '�� SNEAKER CULTURE',
    title1: 'STEP INTO',
    title2: 'THE CULTURE',
    subtitle: 'Street-ready pairs built for comfort and statement.',
    ctaText: 'SHOP SNEAKERS',
    ctaLink: '/products?category=Sneakers',
    images: [
      'https://images.unsplash.com/photo-1549298916-f52d724204b4?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=700&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=700&q=80'
    ]
  }
]

const activeIndex = ref(0)
const paused = ref(false)
const heroRef = ref(null)
let timer = null

function next() {
  activeIndex.value = (activeIndex.value + 1) % slides.length
}

function prev() {
  activeIndex.value = (activeIndex.value - 1 + slides.length) % slides.length
}

onMounted(() => {
  timer = setInterval(() => {
    if (!paused.value) next()
  }, 5000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const { direction } = useSwipe(heroRef, { threshold: 40 })

watch(direction, (value) => {
  if (value === 'left') next()
  if (value === 'right') prev()
})
</script>
