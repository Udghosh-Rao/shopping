<template>
  <div class="relative bg-gradient-to-br from-[#0d0d0d] to-[#1a1a2e] text-white min-h-[90vh] flex items-center overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')]"></div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 relative z-10">
      <div class="max-w-3xl mx-auto text-center animate-fade-in">
        <!-- Tag -->
        <div class="inline-flex items-center gap-2 bg-[#ff6b00] text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
          <span>🔥</span>
          <span>NEW SEASON DROPS</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-6xl md:text-8xl font-black uppercase tracking-wide mb-6 animate-slide-up">
          WEAR YOUR FANDOM
        </h1>

        <!-- Subheading -->
        <p class="text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up animation-delay-200">
          Shop 500+ licensed pop culture tees, sneakers & more
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap justify-center gap-4 animate-slide-up animation-delay-400">
          <button
            @click="$emit('shopNow')"
            class="bg-[#ff6b00] text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-[#ff8533] transition-all transform hover:scale-105"
          >
            SHOP NOW
          </button>
          <button
            @click="$emit('newDrops')"
            class="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-black transition-all transform hover:scale-105"
          >
            NEW DROPS
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['shopNow', 'newDrops'])
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
  animation-fill-mode: forwards;
}
</style>
