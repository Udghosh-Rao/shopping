import { reactive, computed } from 'vue'

export const cartState = reactive({
  isOpen: false,
  items: [
    { 
      id: 1, 
      name: "NEON DEMON HOODIE", 
      price: 85, 
      size: "L", 
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop", 
      quantity: 1 
    }
  ]
})

export const toggleCart = (val) => {
  if (typeof val === 'boolean') cartState.isOpen = val
  else cartState.isOpen = !cartState.isOpen
}

export const addToCart = (product) => {
  const existing = cartState.items.find(i => i.id === product.id && i.size === product.size)
  if (existing) {
    existing.quantity += (product.quantity || 1)
  } else {
    cartState.items.unshift({ ...product, quantity: product.quantity || 1 })
  }
  cartState.isOpen = true
}

export const removeFromCart = (id) => {
  cartState.items = cartState.items.filter(i => i.id !== id)
}

export const updateQuantity = (id, diff) => {
  const item = cartState.items.find(i => i.id === id)
  if (item) {
    item.quantity += diff
    if (item.quantity <= 0) {
      removeFromCart(id)
    }
  }
}

export const cartTotal = computed(() => {
  return cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})
