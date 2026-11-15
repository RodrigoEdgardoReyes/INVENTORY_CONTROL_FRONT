<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProductsStore } from '@/store/product.store';
import type { ProductFormData } from '@/types/product.types';
import ImageUploader from '@/components/common/ImageUploader.vue';

const props = defineProps<{
  initialData?: Partial<ProductFormData>;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: ProductFormData];
  cancel: [];
}>();

const productsStore = useProductsStore();

const form = ref<ProductFormData>({
  name: '',
  sku: '',
  barcode: '',
  categoryId: '',
  description: '',
  imageUrl: '',
  stock: 0,
  minStock: 5,
  purchasePrice: 0,
  salePrice: 0,
  wholesalePrice: 0,
  ...props.initialData
});

onMounted(() => {
  console.log('🟢 [ProductForm] Componente montado. Cargando categorías...');
  if (productsStore.categories.length === 0) productsStore.fetchCategories();
  console.log('🟢 [ProductForm] Categorías cargadas:', productsStore.categories);
});

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Imagen -->
      <div class="md:col-span-1">
        <ImageUploader v-model="form.imageUrl" />
      </div>

      <!-- Datos Principales -->
      <div class="md:col-span-2 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre del Producto *</label>
            <input v-model="form.name" required type="text" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Categoría *</label>
            <select v-model="form.categoryId" required class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="" disabled>Seleccione una categoría</option>
              <option v-for="cat in productsStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">SKU / Código Interno *</label>
            <input v-model="form.sku" required type="text" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Código de Barras</label>
            <input v-model="form.barcode" type="text" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Stock Actual *</label>
        <input v-model.number="form.stock" required type="number" min="0" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Stock Mínimo *</label>
        <input v-model.number="form.minStock" required type="number" min="0" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Precio Compra *</label>
        <input v-model.number="form.purchasePrice" required type="number" step="0.01" min="0" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Precio Venta *</label>
        <input v-model.number="form.salePrice" required type="number" step="0.01" min="0" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea v-model="form.description" rows="3" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
      <button type="button" @click="emit('cancel')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
      <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        {{ isEditing ? 'Guardar Cambios' : 'Crear Producto' }}
      </button>
    </div>
  </form>
</template>