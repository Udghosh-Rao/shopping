<template>
  <footer class="bg-[#0d0d0d] text-white mt-16">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Column 1: Brand -->
        <div>
          <h3 class="text-2xl font-black text-[#ff6b00] mb-4">SHOPZONE</h3>
          <p class="text-gray-400 text-sm mb-4">
            Your one-stop destination for licensed pop culture merchandise. Wear your fandom with pride!
          </p>
          <div class="flex gap-3">
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff6b00] transition">
              <span>📸</span>
            </a>
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff6b00] transition">
              <span>🐦</span>
            </a>
            <a href="#" class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff6b00] transition">
              <span>▶️</span>
            </a>
          </div>
        </div>

        <!-- Column 2: Shop -->
        <div>
          <h4 class="font-bold mb-4 uppercase tracking-wide">SHOP</h4>
          <ul class="space-y-2 text-sm">
            <li><RouterLink to="/products?category=T-Shirts" class="text-gray-400 hover:text-[#ff6b00] transition">T-Shirts</RouterLink></li>
            <li><RouterLink to="/products?category=Shirts" class="text-gray-400 hover:text-[#ff6b00] transition">Shirts</RouterLink></li>
            <li><RouterLink to="/products?category=Joggers" class="text-gray-400 hover:text-[#ff6b00] transition">Joggers</RouterLink></li>
            <li><RouterLink to="/products?category=Sneakers" class="text-gray-400 hover:text-[#ff6b00] transition">Sneakers</RouterLink></li>
            <li><RouterLink to="/products?category=Accessories" class="text-gray-400 hover:text-[#ff6b00] transition">Accessories</RouterLink></li>
          </ul>
        </div>

        <!-- Column 3: Help -->
        <div>
          <h4 class="font-bold mb-4 uppercase tracking-wide">HELP</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-gray-400 hover:text-[#ff6b00] transition">Track Order</a></li>
            <li><a href="#" class="text-gray-400 hover:text-[#ff6b00] transition">Returns</a></li>
            <li><a href="#" class="text-gray-400 hover:text-[#ff6b00] transition">Size Guide</a></li>
            <li><a href="#" class="text-gray-400 hover:text-[#ff6b00] transition">FAQs</a></li>
            <li><a href="#" class="text-gray-400 hover:text-[#ff6b00] transition">Contact Us</a></li>
          </ul>
        </div>

        <!-- Column 4: Newsletter -->
        <div>
          <h4 class="font-bold mb-4 uppercase tracking-wide">CONNECT</h4>
          <p class="text-gray-400 text-sm mb-3">Subscribe to get exclusive offers & updates</p>
          <form class="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              class="flex-1 px-3 py-2 bg-gray-800 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6b00]"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-[#ff6b00] rounded font-bold hover:bg-[#ff8533] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
        <p>© 2026 ShopZone. All rights reserved.</p>
        <div class="flex gap-6 mt-4 md:mt-0">
          <a href="#" class="hover:text-[#ff6b00] transition">Privacy Policy</a>
          <a href="#" class="hover:text-[#ff6b00] transition">Terms of Use</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
