<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProductsStore } from "@/store/product.store";
import ProductForm from "@/components/forms/ProductForm.vue";
import type { ProductFormData } from "@/types/product.types";

const router = useRouter();
const store = useProductsStore();

const handleSubmit = async (data: ProductFormData) => {
  try {
    await store.createProduct(data);
    router.push("/products");
  } catch (error: any) {
    console.error("❌ Error completo del backend:", error.response?.data);
    alert(
      `Error: ${error.response?.data?.message || "Error al crear producto"}`,
    );
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Nuevo Producto</h1>
      <p class="text-gray-500">
        Ingresa los detalles del nuevo artículo a tu inventario.
      </p>
    </div>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <ProductForm @submit="handleSubmit" @cancel="router.push('/products')" />
    </div>
  </div>
</template>
