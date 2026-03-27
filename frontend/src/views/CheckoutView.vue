<template>
  <div class="min-h-screen bg-[var(--black)] relative pt-24 pb-12 overflow-hidden">
    <!-- Animated Gradients -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-orange/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen -translate-y-1/2 translate-x-1/3"></div>

    <div class="container mx-auto px-6 max-w-5xl relative z-10">
      <h1 class="text-5xl font-display font-black text-white tracking-widest uppercase mb-12">SECURE <span class="text-neon-orange drop-shadow-[0_0_10px_rgba(255,107,0,0.5)]">CHECKOUT</span></h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Left: Checkout Form -->
        <div class="space-y-8 stagger">
          <div class="glass-card p-8 reveal visible">
            <h2 class="font-display font-black text-2xl text-white tracking-widest mb-6 flex items-center gap-3">
              <span class="text-neon-orange">01.</span> DELIVERY COORDS
            </h2>
            <form @submit.prevent="placeOrder" class="space-y-5" id="checkout-form">
              <div>
                <input v-model="address.full_name" required type="text" placeholder="FULL NAME" class="input-dark w-full h-14 bg-black/50 tracking-widest uppercase" />
              </div>
              <div>
                <input v-model="address.phone" required type="tel" placeholder="PHONE NUMBER" class="input-dark w-full h-14 bg-black/50 tracking-widest uppercase" />
              </div>
              <div>
                <input v-model="address.line1" required type="text" placeholder="ADDRESS LINE 1" class="input-dark w-full h-14 bg-black/50 tracking-widest uppercase" />
              </div>
              <div>
                <input v-model="address.line2" type="text" placeholder="ADDRESS LINE 2 (OPTIONAL)" class="input-dark w-full h-14 bg-black/50 tracking-widest uppercase" />
              </div>
              <div class="grid grid-cols-2 gap-5">
                <input v-model="address.city" required type="text" placeholder="CITY" class="input-dark w-full h-14 bg-black/50 tracking-widest uppercase" />
                <input v-model="address.state" required type="text" placeholder="STATE" class="input-dark w-full h-14 bg-black/50 tracking-widest uppercase" />
              </div>
              <div>
                <input v-model="address.pincode" required type="text" placeholder="PINCODE" class="input-dark w-full h-14 bg-black/50 tracking-widest uppercase" />
              </div>
            </form>
          </div>

          <div class="glass-card p-8 reveal visible" style="animation-delay: 100ms">
            <h2 class="font-display font-black text-2xl text-white tracking-widest mb-6 flex items-center gap-3">
              <span class="text-neon-orange">02.</span> PAYMENT METHOD
            </h2>
            <div class="space-y-4">
              <label class="flex items-center p-5 border rounded-xl cursor-pointer transition-all duration-300" :class="paymentMethod === 'COD' ? 'border-neon-orange bg-neon-orange/10 shadow-[0_0_20px_rgba(255,107,0,0.15)]' : 'border-white/10 bg-black/30 hover:bg-white/5'">
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4" :class="paymentMethod === 'COD' ? 'border-neon-orange' : 'border-gray-500'">
                  <div class="w-3 h-3 rounded-full bg-neon-orange transition-transform duration-300" :class="paymentMethod === 'COD' ? 'scale-100' : 'scale-0'"></div>
                </div>
                <input type="radio" v-model="paymentMethod" value="COD" class="hidden" />
                <div>
                  <span class="font-bold text-white tracking-widest block uppercase">CASH ON DELIVERY</span>
                  <span class="text-xs text-gray-400 font-bold tracking-widest mt-1 hidden md:block uppercase">Pay when you receive the gear</span>
                </div>
              </label>

              <label class="flex items-center p-5 border rounded-xl cursor-pointer transition-all duration-300" :class="paymentMethod === 'UPI' ? 'border-neon-orange bg-neon-orange/10 shadow-[0_0_20px_rgba(255,107,0,0.15)]' : 'border-white/10 bg-black/30 hover:bg-white/5'">
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4" :class="paymentMethod === 'UPI' ? 'border-neon-orange' : 'border-gray-500'">
                  <div class="w-3 h-3 rounded-full bg-neon-orange transition-transform duration-300" :class="paymentMethod === 'UPI' ? 'scale-100' : 'scale-0'"></div>
                </div>
                <input type="radio" v-model="paymentMethod" value="UPI" class="hidden" />
                <div>
                  <span class="font-bold text-white tracking-widest block uppercase">UPI</span>
                </div>
              </label>

              <label class="flex items-center p-5 border rounded-xl cursor-pointer transition-all duration-300" :class="paymentMethod === 'Card' ? 'border-neon-orange bg-neon-orange/10 shadow-[0_0_20px_rgba(255,107,0,0.15)]' : 'border-white/10 bg-black/30 hover:bg-white/5'">
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4" :class="paymentMethod === 'Card' ? 'border-neon-orange' : 'border-gray-500'">
                  <div class="w-3 h-3 rounded-full bg-neon-orange transition-transform duration-300" :class="paymentMethod === 'Card' ? 'scale-100' : 'scale-0'"></div>
                </div>
                <input type="radio" v-model="paymentMethod" value="Card" class="hidden" />
                <div>
                  <span class="font-bold text-white tracking-widest block uppercase">CREDIT / DEBIT CARD</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Right: Order Summary -->
        <div>
          <div class="glass-card p-8 sticky top-28 reveal visible" style="animation-delay: 200ms">
            <h2 class="font-display font-black text-2xl text-white tracking-widest mb-6 border-b border-white/10 pb-4">ORDER SUMMARY</h2>
            
            <div class="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="(item, index) in cartStore.items" :key="index" class="flex justify-between items-center text-sm">
                <div class="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <div class="w-12 h-12 bg-white/5 rounded-lg border border-white/10 overflow-hidden flex-shrink-0">
                    <img :src="item.image" class="w-full h-full object-cover mix-blend-overlay opacity-80" />
                  </div>
                  <div class="truncate">
                    <p class="font-bold text-white uppercase tracking-wider truncate">{{ item.name }}</p>
                    <p class="text-xs font-bold text-gray-500 tracking-widest">QTY: {{ item.quantity }}</p>
                  </div>
                </div>
                <span class="font-bold text-white whitespace-nowrap tracking-wider">₹{{ item.price * item.quantity }}</span>
              </div>
            </div>

            <div class="border-t border-white/10 pt-6 space-y-4 mb-8">
              <div class="flex justify-between text-sm font-bold text-gray-400 tracking-widest">
                <span>SUBTOTAL</span>
                <span class="text-white text-lg">₹{{ cartStore.totalPrice }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-gray-400 tracking-widest">
                <span>DELIVERY</span>
                <span class="text-neon-cyan">{{ cartStore.totalPrice >= 499 ? 'FREE' : '₹49' }}</span>
              </div>
              <div class="border-t border-white/10 pt-4 flex justify-between text-xl font-black text-white tracking-widest">
                <span>TOTAL</span>
                <span class="text-3xl text-neon-orange drop-shadow-[0_0_10px_rgba(255,107,0,0.3)]">₹{{ cartStore.totalPrice + (cartStore.totalPrice >= 499 ? 0 : 49) }}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" :disabled="placing" class="btn-glow-orange w-full flex justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="placing" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span v-else>CONFIRM TRANSMISSION →</span>
            </button>
            <p class="text-[10px] font-bold text-gray-500 tracking-widest text-center mt-4">ENCRYPTED CONNECTION</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useToast } from '../composables/useToast'
import api from '../services/api'

const router = useRouter()
const cartStore = useCartStore()
const { showToast } = useToast()

const address = ref({
  full_name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: ''
})
const paymentMethod = ref('COD')
const placing = ref(false)

const placeOrder = async () => {
  try {
    placing.value = true
    await api.post('/orders/checkout', {
      address: address.value,
      payment_method: paymentMethod.value
    })
    showToast('Secure transmission complete. Order acquired.', 'success')
    cartStore.clearCart()
    router.push('/order-success')
  } catch (error) {
    showToast(error.response?.data?.error || 'Transmission failed. Try again.', 'error')
  } finally {
    placing.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 107, 0, 0.5);
  border-radius: 4px;
}
</style>
