<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useProductsStore } from '@/store/product.store';
import { formatCurrency } from '@/utils/formatters';
import { ROUTES } from '@/config/constants';

const router = useRouter();
const store = useProductsStore();

onMounted(() => {
  store.fetchProducts();
});

// Debounce para la búsqueda
let timeout: ReturnType<typeof setTimeout>;
watch(() => store.filters.search, () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => store.fetchProducts(), 500);
});

watch(() => [store.filters.categoryId, store.filters.lowStock], () => {
  store.fetchProducts();
});

const handleDelete = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    await store.deleteProduct(id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Productos</h1>
      <button @click="router.push('/products/create')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        + Nuevo Producto
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
      <input v-model="store.filters.search" type="text" placeholder="Buscar por nombre o SKU..." class="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      
      <select v-model="store.filters.categoryId" class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        <option value="">Todas las categorías</option>
        <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>

      <label class="flex items-center space-x-2 text-sm text-gray-700">
        <input type="checkbox" v-model="store.filters.lowStock" class="rounded text-indigo-600 focus:ring-indigo-500">
        <span>Solo Stock Bajo</span>
      </label>
    </div>

    <!-- Tabla -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
          <tr>
            <th class="px-6 py-3 font-medium">Producto</th>
            <th class="px-6 py-3 font-medium">SKU</th>
            <th class="px-6 py-3 font-medium">Categoría</th>
            <th class="px-6 py-3 font-medium">Stock</th>
            <th class="px-6 py-3 font-medium">Precio Venta</th>
            <th class="px-6 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="store.isLoading">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500">Cargando...</td>
          </tr>
          <tr v-else-if="store.products.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500">No hay productos registrados.</td>
          </tr>
          <tr v-for="prod in store.products" :key="prod.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 flex items-center space-x-3">
              <img v-if="prod.imageUrl" :src="prod.imageUrl" class="w-10 h-10 rounded object-cover" />
              <div v-else class="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400">📦</div>
              <span class="font-medium text-gray-900">{{ prod.name }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ prod.sku }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ prod.category?.name || 'N/A' }}</td>
            <td class="px-6 py-4 text-sm">
              <span :class="prod.stock <= prod.minStock ? 'text-red-600 font-bold' : 'text-gray-900'">
                {{ prod.stock }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ formatCurrency(prod.salePrice) }}</td>
            <td class="px-6 py-4 text-sm text-right space-x-2">
              <button @click="router.push(`/products/${prod.id}/edit`)" class="text-indigo-600 hover:text-indigo-900">Editar</button>
              <button @click="handleDelete(prod.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>