<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">Productos</h2>
      <AppButton variant="primary" @click="showCreateModal = true">
        Nuevo Producto
      </AppButton>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AppInput
          v-model="productsStore.searchQuery"
          placeholder="Buscar por nombre o SKU..."
          label="Búsqueda"
        />
        <select
          v-model="productsStore.categoryFilter"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Todas las categorías</option>
          <option v-for="cat in productsStore.categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tabla de Productos -->
    <AppCard :loading="productsStore.loading">
      <AppTable
        :columns="columns"
        :data="productsStore.filteredProducts"
      >
        <template #cell-stock="{ row }">
          <div class="flex items-center space-x-2">
            <span :class="row.stock <= row.minStock ? 'text-red-600 font-semibold' : 'text-gray-900'">
              {{ row.stock }}
            </span>
            <AppBadge v-if="row.stock <= row.minStock" variant="danger">
              Stock Bajo
            </AppBadge>
          </div>
        </template>
        <template #cell-purchasePrice="{ row }">
          <span>${{ formatNumber(row.purchasePrice) }}</span>
        </template>
        <template #cell-salePrice="{ row }">
          <span>${{ formatNumber(row.salePrice) }}</span>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex space-x-2">
            <AppButton variant="secondary" size="sm" @click="editProduct(row)">
              Editar
            </AppButton>
            <AppButton variant="primary" size="sm" @click="viewMovements(row)">
              Movimientos
            </AppButton>
          </div>
        </template>
      </AppTable>
    </AppCard>

    <!-- Modal de Crear/Editar -->
    <AppModal
      :visible="showCreateModal || showEditModal"
      :title="editingProduct ? 'Editar Producto' : 'Nuevo Producto'"
      @close="closeModal"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model="form.name" label="Nombre *" required />
          <AppInput v-model="form.sku" label="SKU *" required />
        </div>
        <AppInput v-model="form.category" label="Categoría *" required />
        <AppInput v-model="form.description" label="Descripción" />
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model.number="form.stock" label="Stock Inicial" type="number" />
          <AppInput v-model.number="form.minStock" label="Stock Mínimo" type="number" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <AppInput v-model.number="form.purchasePrice" label="Precio Compra" type="number" />
          <AppInput v-model.number="form.salePrice" label="Precio Venta" type="number" />
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <AppButton variant="secondary" @click="closeModal">
            Cancelar
          </AppButton>
          <AppButton type="submit" variant="primary" :loading="productsStore.loading">
            Guardar
          </AppButton>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '../../store/productStore'
import AppCard from '../../components/common/AppCard.vue'
import AppTable from '../../components/common/AppTable.vue'
import AppButton from '../../components/common/AppButton.vue'
import AppInput from '../../components/common/AppInput.vue'
import AppModal from '../../components/common/AppModal.vue'
import AppBadge from '../../components/common/AppBadge.vue'

const router = useRouter()
const productsStore = useProductsStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingProduct = ref<any>(null)

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'name', label: 'Nombre' },
  { key: 'category', label: 'Categoría' },
  { key: 'stock', label: 'Stock' },
  { key: 'minStock', label: 'Stock Mín.' },
  { key: 'purchasePrice', label: 'P. Compra' },
  { key: 'salePrice', label: 'P. Venta' },
  { key: 'actions', label: 'Acciones' }
]

const form = reactive({
  name: '',
  sku: '',
  category: '',
  description: '',
  stock: 0,
  minStock: 0,
  purchasePrice: 0,
  salePrice: 0
})

// Funciones de utilidad
const formatNumber = (value: number) => {
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function resetForm() {
  form.name = ''
  form.sku = ''
  form.category = ''
  form.description = ''
  form.stock = 0
  form.minStock = 0
  form.purchasePrice = 0
  form.salePrice = 0
}

function editProduct(product: any) {
  editingProduct.value = product
  form.name = product.name
  form.sku = product.sku
  form.category = product.category
  form.description = product.description || ''
  form.stock = product.stock
  form.minStock = product.minStock
  form.purchasePrice = product.purchasePrice
  form.salePrice = product.salePrice
  showEditModal.value = true
}

function viewMovements(product: any) {
  router.push(`/kardex?product=${product.id}`)
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingProduct.value = null
  resetForm()
}

async function handleSubmit() {
  let success
  if (editingProduct.value) {
    success = await productsStore.updateProduct(editingProduct.value.id, form)
  } else {
    success = await productsStore.createProduct(form)
  }
  
  if (success) {
    closeModal()
  }
}

onMounted(() => {
  productsStore.fetchProducts()
})
</script>