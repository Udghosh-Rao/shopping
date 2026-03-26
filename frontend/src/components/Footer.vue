<template>
  <footer class="bg-[var(--dark)] relative pt-20 pb-10 overflow-hidden">
    <!-- Top Gradient Line -->
    <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-neon-orange via-neon-pink to-neon-purple"></div>

    <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
      
      <!-- Brand -->
      <div class="col-span-1 md:col-span-1">
        <h2 class="text-4xl font-display font-black tracking-widest mb-6 cursor-pointer group w-fit">
          <span class="anim-gradient inline-block bg-clip-text text-transparent group-hover:scale-105 transition-transform" style="background-image: var(--grad-neon); background-size: 200% 200%;">
            ASH<span class="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">KAIR</span>
          </span>
        </h2>
        <p class="text-gray-400 text-sm leading-relaxed mb-8">
          The ultimate stop for premium drip, geek culture, and hypebeast essentials. 
          Stand out from the crowd.
        </p>
        <div class="flex gap-4">
          <a href="#" class="social-icon group instagram"><span class="group-hover:text-neon-pink">IG</span></a>
          <a href="#" class="social-icon group twitter"><span class="group-hover:text-blue-400">TW</span></a>
          <a href="#" class="social-icon group youtube"><span class="group-hover:text-red-500">YT</span></a>
        </div>
      </div>

      <!-- Links 1 -->
      <div>
        <h3 class="text-white font-bold tracking-widest mb-6">SHOP</h3>
        <ul class="flex flex-col gap-3">
          <li><a href="#" class="footer-link">New Arrivals</a></li>
          <li><a href="#" class="footer-link">Bestsellers</a></li>
          <li><a href="#" class="footer-link">T-Shirts</a></li>
          <li><a href="#" class="footer-link">Sneakers</a></li>
          <li><a href="#" class="footer-link">Accessories</a></li>
        </ul>
      </div>

      <!-- Links 2 -->
      <div>
        <h3 class="text-white font-bold tracking-widest mb-6">SUPPORT</h3>
        <ul class="flex flex-col gap-3">
          <li><a href="#" class="footer-link">Track Order</a></li>
          <li><a href="#" class="footer-link">Returns & Exchanges</a></li>
          <li><a href="#" class="footer-link">Shipping Info</a></li>
          <li><a href="#" class="footer-link">Size Guide</a></li>
          <li><a href="#" class="footer-link">FAQ</a></li>
        </ul>
      </div>


    </div>

    <!-- Bottom Bar -->
    <div class="container mx-auto px-6 mt-20">
      <div class="glass-card !border-x-0 !border-b-0 !rounded-none py-6 flex flex-col md:flex-row items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
        <p>© 2026 ASHKAIR. ALL RIGHTS RESERVED.</p>
        <div class="flex gap-6 mt-4 md:mt-0">
          <a href="#" class="hover:text-white transition-colors">PRIVACY POLICY</a>
          <a href="#" class="hover:text-white transition-colors">TERMS OF SERVICE</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  transition: all 0.3s var(--ease-smooth);
}
.social-icon:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255,0.1);
}
.social-icon.instagram:hover { box-shadow: 0 0 20px rgba(255,45,120,0.4); border-color: rgba(255,45,120,0.5); }
.social-icon.twitter:hover   { box-shadow: 0 0 20px rgba(96,165,250,0.4); border-color: rgba(96,165,250,0.5); }
.social-icon.youtube:hover   { box-shadow: 0 0 20px rgba(239,68,68,0.4); border-color: rgba(239,68,68,0.5); }

.footer-link {
  color: var(--gray-400);
  font-size: 14px;
  transition: all 0.3s var(--ease-smooth);
  display: inline-block;
}
.footer-link:hover {
  color: var(--neon-orange);
  transform: translateX(4px);
}
</style>
