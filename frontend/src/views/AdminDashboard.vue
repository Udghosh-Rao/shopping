<script setup>
import { onMounted, reactive, ref } from 'vue'
import api from '../services/api'

const products = ref([])
const error = ref('')
const loading = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  image_url: ''
})

function resetForm() {
  form.name = ''
  form.description = ''
  form.price = 0
  form.stock = 0
  form.category = ''
  form.image_url = ''
  editingId.value = null
}

async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get('/products', { params: { per_page: 50 } })
    products.value = data.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
}

function startEdit(product) {
  editingId.value = product.id
  form.name = product.name
  form.description = product.description
  form.price = product.price
  form.stock = product.stock
  form.category = product.category
  form.image_url = product.image_url
}

async function submitForm() {
  error.value = ''
  try {
    if (editingId.value) {
      await api.put(`/products/${editingId.value}`, form)
    } else {
      await api.post('/products', form)
    }
    resetForm()
    await loadProducts()
  } catch (err) {
    error.value = err.response?.data?.message || 'Save failed'
  }
}

async function deleteProduct(id) {
  error.value = ''
  try {
    await api.delete(`/products/${id}`)
    await loadProducts()
  } catch (err) {
    error.value = err.response?.data?.message || 'Delete failed'
  }
}

onMounted(loadProducts)
</script>

<template>
  <section class="space-y-6">
    <h1 class="text-2xl font-bold">Admin Dashboard</h1>

    <div class="bg-white rounded-2xl shadow-md p-4">
      <h2 class="font-semibold mb-3">{{ editingId ? 'Edit Product' : 'Create Product' }}</h2>
      <form class="grid md:grid-cols-2 gap-3" @submit.prevent="submitForm">
        <input v-model="form.name" placeholder="Name" class="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        <input v-model="form.category" placeholder="Category" class="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        <input v-model.number="form.price" type="number" step="0.01" placeholder="Price" class="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        <input v-model.number="form.stock" type="number" placeholder="Stock" class="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" required />
        <input v-model="form.image_url" placeholder="Image URL" class="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 md:col-span-2" required />
        <textarea v-model="form.description" placeholder="Description" class="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 md:col-span-2" required />
        <div class="md:col-span-2 flex gap-2">
          <button class="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
            {{ editingId ? 'Update Product' : 'Create Product' }}
          </button>
          <button type="button" class="bg-slate-200 px-4 py-2 rounded-lg" @click="resetForm">Reset</button>
        </div>
      </form>
      <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
    </div>

    <div class="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
      <h2 class="font-semibold mb-3">Products</h2>
      <p v-if="loading" class="text-slate-600">Loading...</p>
      <table v-else class="w-full text-sm">
        <thead class="text-left bg-slate-100">
          <tr>
            <th class="p-2">Name</th>
            <th class="p-2">Category</th>
            <th class="p-2">Price</th>
            <th class="p-2">Stock</th>
            <th class="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-b">
            <td class="p-2">{{ product.name }}</td>
            <td class="p-2">{{ product.category }}</td>
            <td class="p-2">${{ product.price.toFixed(2) }}</td>
            <td class="p-2">{{ product.stock }}</td>
            <td class="p-2 flex gap-2">
              <button class="px-2 py-1 bg-indigo-100 rounded" @click="startEdit(product)">Edit</button>
              <button class="px-2 py-1 bg-red-100 rounded text-red-700" @click="deleteProduct(product.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
