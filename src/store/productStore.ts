import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
  id: number
  name: string
  sku: string
  category: string
  description?: string
  stock: number
  minStock: number
  purchasePrice: number
  salePrice: number
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([
    { id: 1, name: 'Laptop HP', sku: 'HP-001', category: 'Electrónicos', description: 'Laptop 16GB RAM', stock: 15, minStock: 5, purchasePrice: 700, salePrice: 899.99 },
    { id: 2, name: 'Mouse Logitech', sku: 'LG-002', category: 'Periféricos', stock: 45, minStock: 10, purchasePrice: 20, salePrice: 29.99 },
    { id: 3, name: 'Monitor Samsung', sku: 'SM-003', category: 'Electrónicos', stock: 8, minStock: 5, purchasePrice: 250, salePrice: 299.99 },
  ])
  
  const loading = ref(false)
  const searchQuery = ref('')
  const categoryFilter = ref('')

  const categories = computed(() => {
    const cats = new Set(products.value.map(p => p.category))
    return Array.from(cats)
  })

  const filteredProducts = computed(() => {
    let result = products.value
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.sku.toLowerCase().includes(query)
      )
    }
    
    if (categoryFilter.value) {
      result = result.filter(p => p.category === categoryFilter.value)
    }
    
    return result
  })

  const fetchProducts = async () => {
    loading.value = true
    // Simular API
    await new Promise(resolve => setTimeout(resolve, 500))
    loading.value = false
  }

  const createProduct = async (product: Omit<Product, 'id'>) => {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    const newProduct = { ...product, id: products.value.length + 1 }
    products.value.push(newProduct)
    loading.value = false
    return true
  }

  const updateProduct = async (id: number, product: Partial<Product>) => {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...product }
    }
    loading.value = false
    return true
  }

  return {
    products,
    loading,
    searchQuery,
    categoryFilter,
    categories,
    filteredProducts,
    fetchProducts,
    createProduct,
    updateProduct
  }
})