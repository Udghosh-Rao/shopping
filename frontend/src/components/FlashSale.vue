<template>
  <div class="relative w-full rounded-[2rem] bg-gradient-to-br from-[#1a1010] to-[#050505] border border-red-500/20 overflow-hidden group">
    
    <!-- Glow Backdrop -->
    <div class="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors z-0"></div>
    <div class="absolute -top-32 -right-32 w-96 h-96 bg-red-500/20 blur-[100px] rounded-full z-0"></div>

    <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 p-10 md:p-16">
      
      <!-- Text content -->
      <div class="text-center md:text-left flex-1 max-w-xl">
        <div class="inline-block px-5 py-2 rounded-full bg-red-500/10 text-red-500 font-bold text-xs tracking-widest uppercase mb-6 border border-red-500/30 anim-glow">
          ⚡ 24H FLASH SALE
        </div>
        <h2 class="text-5xl md:text-7xl font-display font-black text-white leading-none mb-6">
          HYPEBEAST<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">ESSENTIALS</span>
        </h2>
        <p class="text-gray-400 text-lg md:text-xl font-medium mb-8">Up to 60% off select streetwear and exclusive anime collaborations. Grab them before they're gone forever.</p>
        
        <button class="px-10 py-5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-full tracking-widest uppercase transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center gap-3">
          <span>SHOP THE SALE</span>
          <span class="text-xl">→</span>
        </button>
      </div>

      <!-- Flip Timer -->
      <div class="flex gap-4 md:gap-6 justify-center">
        <!-- Hours -->
        <div class="flex flex-col items-center gap-4">
          <div class="flip-card">
            <span :key="'h-'+hours" class="flip-digit">{{ hours }}</span>
          </div>
          <span class="text-xs text-red-400 font-bold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">HOURS</span>
        </div>
        
        <div class="text-4xl text-red-500 font-display mt-4 anim-pulse shadow-red pt-4">:</div>
        
        <!-- Minutes -->
        <div class="flex flex-col items-center gap-4">
          <div class="flip-card">
            <span :key="'m-'+minutes" class="flip-digit">{{ minutes }}</span>
          </div>
          <span class="text-xs text-red-400 font-bold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">MINS</span>
        </div>
        
        <div class="text-4xl text-red-500 font-display mt-4 anim-pulse shadow-red pt-4">:</div>
        
        <!-- Seconds -->
        <div class="flex flex-col items-center gap-4">
          <div class="flip-card text-red-500 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <span :key="'s-'+seconds" class="flip-digit">{{ seconds }}</span>
          </div>
          <span class="text-xs text-red-400 font-bold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">SECS</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hours = ref('12')
const minutes = ref('59')
const seconds = ref('59')
let interval

onMounted(() => {
  // Mock countdown time (e.g. 12hr 59min 59sec)
  let totalSeconds = 12 * 3600 + 59 * 60 + 59
  
  interval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(interval)
      return
    }
    totalSeconds--
    
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    
    hours.value = h.toString().padStart(2, '0')
    minutes.value = m.toString().padStart(2, '0')
    seconds.value = s.toString().padStart(2, '0')
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.flip-card {
  width: 5rem;
  height: 6rem;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 3.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  perspective: 1000px;
}
@media (min-width: 768px) {
  .flip-card {
    width: 6rem;
    height: 7.5rem;
    font-size: 4.5rem;
    border-radius: 20px;
  }
}

/* CSS 3D flip animation */
.flip-digit {
  animation: flip 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  display: block;
  backface-visibility: hidden;
}

@keyframes flip {
  0% { transform: rotateX(90deg); opacity: 0; }
  50% { transform: rotateX(-20deg); opacity: 1; }
  100% { transform: rotateX(0deg); opacity: 1; }
}
</style>
