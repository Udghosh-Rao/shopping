<template>
  <div class="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-center px-6">
    
    <!-- Ultra Minimalist Background watermark -->
    <div class="absolute inset-0 flex flex-col justify-center items-center pointer-events-none opacity-[0.02]">
      <h1 class="text-[40vw] font-display font-black leading-none uppercase select-none">404</h1>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center">
      <h2 class="text-xs md:text-sm font-bold tracking-[0.5em] text-gray-500 uppercase mb-4">Error 404</h2>
      
      <h1 class="text-5xl md:text-7xl font-display font-black tracking-[0.1em] text-white uppercase mb-8">
        Not Found
      </h1>
      
      <p class="text-gray-400 font-bold tracking-widest text-xs uppercase mb-12 max-w-sm leading-relaxed">
        The piece you're looking for has been archived or doesn't exist.
      </p>

      <button 
        @click="$router.push('/')" 
        class="border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all duration-500 px-12 py-4 tracking-[0.2em] text-xs font-bold uppercase backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.05)]"
      >
        Return Home
      </button>
    </div>
  </div>
</template>

<script setup>
</script>
