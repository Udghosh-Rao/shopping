<template>
  <div class="min-h-screen bg-[var(--black)] pt-24 pb-12 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 class="text-4xl font-display font-black text-white tracking-widest uppercase">ADMIN PRODUCTS</h1>
        <router-link to="/admin" class="btn-glass">Dashboard</router-link>
      </div>

      <form @submit.prevent="createProduct" class="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input v-model="newProduct.name" required placeholder="Name" class="input-dark" />
        <input v-model="newProduct.category" required placeholder="Category" class="input-dark" />
        <input v-model.number="newProduct.price" required type="number" min="0" step="0.01" placeholder="Price" class="input-dark" />
        <input v-model.number="newProduct.stock" required type="number" min="0" placeholder="Stock" class="input-dark" />
        <input v-model="newProduct.image_url" required placeholder="Image URL" class="input-dark md:col-span-2" />
        <textarea v-model="newProduct.description" required placeholder="Description" rows="3" class="input-dark md:col-span-2"></textarea>
        <button class="btn-glow-orange md:col-span-2">Create Product</button>
      </form>

      <div class="glass-card overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/10 text-left text-gray-400">
              <th class="p-4">Name</th><th class="p-4">Category</th><th class="p-4">Price</th><th class="p-4">Stock</th><th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="border-b border-white/5 text-white">
              <td class="p-4">{{ product.name }}</td>
              <td class="p-4">{{ product.category }}</td>
              <td class="p-4">₹{{ product.price }}</td>
              <td class="p-4">{{ product.stock }}</td>
              <td class="p-4">
                <button class="text-red-400 hover:text-red-300" @click="deleteProduct(product.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../../services/api'
import { useToast } from '../../composables/useToast'

const { showToast } = useToast()
const products = ref([])
const newProduct = ref({
  name: '',
  category: '',
  description: '',
  price: 0,
  stock: 0,
  image_url: ''
})

const loadProducts = async () => {
  const { data } = await api.get('/admin/products', { params: { per_page: 100 } })
  products.value = data.products || []
}

const createProduct = async () => {
  try {
    await api.post('/admin/products', newProduct.value)
    showToast('Product created', 'success')
    newProduct.value = { name: '', category: '', description: '', price: 0, stock: 0, image_url: '' }
    await loadProducts()
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to create product', 'error')
  }
}

const deleteProduct = async (id) => {
  try {
    await api.delete(`/admin/products/${id}`)
    showToast('Product deleted', 'success')
    await loadProducts()
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to delete product', 'error')
  }
}

onMounted(async () => {
  try {
    await loadProducts()
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to load products', 'error')
  }
})
</script>
