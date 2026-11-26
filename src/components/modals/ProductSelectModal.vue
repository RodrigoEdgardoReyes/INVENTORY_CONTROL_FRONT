<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProductsStore } from '@/store/product.store';
import type { Product } from '@/types/product.types';
import { formatCurrency } from '@/utils/formatters';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: []; select: [product: Product, quantity: number] }>();

const productStore = useProductsStore();
const searchQuery = ref('');
const selectedProduct = ref<Product | null>(null);
const quantity = ref(1);

onMounted(() => {
  if (productStore.products.length === 0) productStore.fetchProducts();
});

const filteredProducts = computed(() => {
  let result = productStore.products.filter(p => p.active && p.stock > 0);
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }
  return result;
});

const handleSelect = () => {
  if (!selectedProduct.value) return;
  emit('select', selectedProduct.value, quantity.value);
  selectedProduct.value = null;
  quantity.value = 1;
  searchQuery.value = '';
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900">Seleccionar Producto</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
      </div>

      <!-- Body -->
      <div class="p-4 flex-1 overflow-hidden flex flex-col">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar por nombre o SKU..." 
          class="w-full mb-4 px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        >
        
        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 border-b sticky top-0">
              <tr>
                <th class="p-3 text-sm font-medium text-gray-500">Producto</th>
                <th class="p-3 text-sm font-medium text-gray-500">Stock</th>
                <th class="p-3 text-sm font-medium text-gray-500">Precio</th>
                <th class="p-3 text-sm font-medium text-gray-500">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="p in filteredProducts" :key="p.id" class="hover:bg-gray-50">
                <td class="p-3">
                  <p class="font-medium text-gray-900">{{ p.name }}</p>
                  <p class="text-xs text-gray-500">{{ p.sku }}</p>
                </td>
                <td class="p-3 text-sm text-gray-700">{{ p.stock }}</td>
                <td class="p-3 text-sm text-gray-700">{{ formatCurrency(p.salePrice) }}</td>
                <td class="p-3">
                  <button @click="selectedProduct = p" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Seleccionar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer (Confirmación) -->
      <div v-if="selectedProduct" class="p-4 border-t bg-gray-50 rounded-b-xl flex items-center justify-between">
        <div>
          <p class="text-sm font-bold text-gray-900">{{ selectedProduct.name }}</p>
          <p class="text-xs text-gray-500">Stock disponible: {{ selectedProduct.stock }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <input 
            v-model.number="quantity" 
            type="number" 
            min="1" 
            :max="selectedProduct.stock" 
            class="w-20 px-2 py-1 border rounded-md text-center"
          >
          <button 
            @click="handleSelect" 
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 font-medium text-sm"
          >
            Agregar a la Venta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>