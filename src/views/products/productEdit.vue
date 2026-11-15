<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductsStore } from '@/store/product.store';
import { productApi } from '@/api';
import ProductForm from '@/components/forms/ProductForm.vue';
import type { ProductFormData } from '@/types/product.types';

const router = useRouter();
const route = useRoute();
const store = useProductsStore();

const initialData = ref<ProductFormData | null>(null);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    const product = await productApi.getProductById(id);
    initialData.value = {
      name: product.name,
      sku: product.sku,
      barcode: product.barcode || '',
      categoryId: product.categoryId,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      stock: Number(product.stock),
      minStock: Number(product.minStock),
      purchasePrice: Number(product.purchasePrice),
      salePrice: Number(product.salePrice),         
      wholesalePrice: product.wholesalePrice ? Number(product.wholesalePrice) : 0
    };
  } catch (error) {
    alert('Producto no encontrado');
    router.push('/products');
  }
});

const handleSubmit = async (data: ProductFormData) => {
  try {
    await store.updateProduct(route.params.id as string, data);
    router.push('/products');
  } catch (error) {
    alert('Error al actualizar producto');
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Editar Producto</h1>
    <div v-if="initialData" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <ProductForm :initial-data="initialData" :is-editing="true" @submit="handleSubmit" @cancel="router.push('/products')" />
    </div>
    <div v-else class="text-center py-12 text-gray-500">Cargando datos...</div>
  </div>
</template>