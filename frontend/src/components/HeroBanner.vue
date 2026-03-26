<template>
  <div class="relative w-full h-[90vh] bg-black flex items-center justify-center overflow-hidden">
    
    <!-- Ultra minimalist full screen background -->
    <div class="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1920&auto=format&fit=crop" 
        class="w-full h-full object-cover opacity-50 grayscale mix-blend-screen transition-all duration-1000 hover:grayscale-0" 
        alt="Ashkair Collection" 
      />
      <!-- Dramatic dark fade at the bottom -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
    </div>

    <!-- Minimal Text -->
    <div class="relative z-10 text-center flex flex-col items-center px-6">
      <h1 class="text-6xl sm:text-8xl md:text-[130px] font-display font-black tracking-[0.15em] text-white leading-none mb-4 drop-shadow-2xl uppercase mix-blend-overlay">
        ASHKAIR
      </h1>
      <p class="text-gray-400 text-xs md:text-sm tracking-[0.4em] uppercase mb-12 font-bold drop-shadow-md">
        Season One
      </p>
      
      <button class="border border-white/20 bg-black/30 hover:bg-white text-white hover:text-black transition-all duration-700 px-14 py-5 tracking-[0.3em] text-xs font-bold uppercase backdrop-blur-md">
        Explore
      </button>
    </div>
  </div>
</template>

<script setup>
</script>
