<template>
  <footer class="mt-16">
    <div class="bg-orange-500 text-white text-center py-2 font-black tracking-wide">INDIA'S FAVOURITE POP CULTURE STORE 🎉</div>

    <div class="bg-[#0d0d0d] text-white">
      <div class="container mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
        <div>
          <p class="text-5xl text-orange-500" style="font-family: var(--font-display)">SHOPZONE</p>
          <p class="text-gray-300 -mt-1">Wear Your Fandom</p>
          <p class="text-sm text-gray-400 mt-3">India's premium destination for licensed pop-culture fashion and accessories.</p>
          <div class="flex gap-2 mt-4">
            <button v-for="icon in ['IG','X','YT','FB']" :key="icon" class="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-500 transition">{{ icon }}</button>
          </div>
          <p class="mt-5 text-xs text-gray-500 uppercase tracking-[0.2em]">Download App</p>
          <div class="flex gap-2 mt-2">
            <button class="px-3 py-2 rounded-full border border-white/20 text-sm">🍎 App Store</button>
            <button class="px-3 py-2 rounded-full border border-white/20 text-sm">▶ Play Store</button>
          </div>
        </div>

        <div>
          <p class="text-orange-400 text-xs tracking-[0.2em] uppercase mb-3">Shop</p>
          <ul class="space-y-2 text-sm text-gray-400">
            <li v-for="item in ['T-Shirts','Shirts','Joggers','Sneakers','Accessories','Phone Cases','Mugs','Posters']" :key="item">
              <RouterLink :to="`/products?category=${encodeURIComponent(item)}`" class="hover:text-orange-400">{{ item }}</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-orange-400 text-xs tracking-[0.2em] uppercase mb-3">Collections</p>
          <ul class="space-y-2 text-sm text-gray-400">
            <li v-for="item in ['Anime','Marvel & DC','Music Bands','Sports','Harry Potter','Star Wars','NASA','Friends TV']" :key="item">
              <RouterLink to="/products" class="hover:text-orange-400">{{ item }}</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-orange-400 text-xs tracking-[0.2em] uppercase mb-3">Help</p>
          <ul class="space-y-2 text-sm text-gray-400">
            <li v-for="item in ['Track Order','Returns & Refunds','Size Guide','FAQs','Contact Us','Shipping Policy','Privacy Policy']" :key="item">
              <RouterLink to="/products" class="hover:text-orange-400">{{ item }}</RouterLink>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-orange-400 text-xs tracking-[0.2em] uppercase mb-3">Contact</p>
          <div class="space-y-2 text-sm text-gray-400">
            <p>📧 support@shopzone.in</p>
            <p>📞 1800-XXX-XXXX (Mon-Sat, 10AM-6PM)</p>
            <p>📍 Mumbai, Maharashtra, India</p>
          </div>
          <div class="mt-4 flex flex-wrap gap-1.5 text-[10px] text-gray-300">
            <span v-for="p in ['Visa','Mastercard','UPI','PhonePe','GPay','Paytm','COD']" :key="p" class="bg-white/10 rounded px-2 py-1">{{ p }}</span>
          </div>
        </div>
      </div>

      <div class="border-t border-white/10 text-xs text-gray-500">
        <div class="container mx-auto px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <p>© 2026 ShopZone Pvt. Ltd. All Rights Reserved.</p>
          <p>Made with ❤️ in India 🇮🇳</p>
          <p class="flex gap-3"><a href="#">Privacy Policy</a><a href="#">Terms</a><a href="#">Sitemap</a></p>
        </div>
      </div>
    </div>
  </footer>
</template>
