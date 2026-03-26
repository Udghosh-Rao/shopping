<template>
  <main class="bg-black min-h-screen text-white pb-10">
    
    <HeroBanner />

    <!-- Minimalist Visual Grid (No text heavy cards) -->
    <section class="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-4 relative z-20 -mt-20 reveal">
      
      <!-- Category 1 -->
      <div class="relative aspect-square md:aspect-[4/3] group overflow-hidden bg-[var(--dark-2)] cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1000&auto=format&fit=crop" 
          class="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.5s] ease-out grayscale group-hover:grayscale-0" 
        />
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 class="text-4xl md:text-6xl font-display font-black tracking-[0.2em] uppercase text-white drop-shadow-2xl mix-blend-overlay">APPAREL</h2>
        </div>
      </div>

      <!-- Category 2 -->
      <div class="relative aspect-square md:aspect-[4/3] group overflow-hidden bg-[var(--dark-2)] cursor-pointer">
        <img 
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" 
          class="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-[1.5s] ease-out grayscale group-hover:grayscale-0" 
        />
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h2 class="text-4xl md:text-6xl font-display font-black tracking-[0.2em] uppercase text-white drop-shadow-2xl mix-blend-overlay">FOOTWEAR</h2>
        </div>
      </div>

    </section>

  </main>
</template>

<script setup>
import HeroBanner from '../components/HeroBanner.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal()
</script>
