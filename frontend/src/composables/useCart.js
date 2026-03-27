import { reactive } from 'vue'

export const cartState = reactive({ isOpen: false })

export const toggleCart = (value) => {
  cartState.isOpen = typeof value === 'boolean' ? value : !cartState.isOpen
}
