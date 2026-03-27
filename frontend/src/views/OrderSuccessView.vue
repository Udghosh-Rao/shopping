<template>
  <div class="min-h-[80vh] bg-[var(--black)] relative pt-24 pb-12 overflow-hidden flex items-center justify-center">
    <!-- Animated Gradients -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-green/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

    <div class="container mx-auto px-6 max-w-2xl relative z-10">
      <div class="glass-card p-16 text-center reveal visible border-neon-green/30 shadow-[0_0_50px_rgba(20,184,166,0.1)]">
        <div class="w-24 h-24 rounded-full border border-neon-green/40 bg-neon-green/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(20,184,166,0.3)] anim-float">
          <span class="text-5xl text-neon-green">✓</span>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-display font-black text-white tracking-widest uppercase mb-4 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">
          TRANSMISSION<br/><span class="text-neon-green">SUCCESSFUL</span>
        </h1>
        
        <p class="text-gray-400 font-bold tracking-widest uppercase mb-12">
          Your gear has been secured. An encrypted confirmation was sent to your commlink.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
          <RouterLink to="/orders" class="btn-glass hover:border-white w-full sm:w-auto text-center px-8">
            TRACK DROPS
          </RouterLink>
          <RouterLink to="/products" class="btn-glow-green w-full sm:w-auto text-center">
            ACQUIRE MORE →
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
