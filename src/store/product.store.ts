// src/store/product.store.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { productApi, categoryApi } from "@/api";
import { useAuthStore } from "@/store/authStore";
import type {
  Product,
  Category,
  ProductFormData,
  ProductFilters,
} from "@/types/product.types";

type CreateProductPayload = ProductFormData & { businessId: string };

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Filtros
  const filters = ref<ProductFilters>({
    search: "",
    categoryId: "",
    lowStock: false,
    page: 1,
    limit: 10,
  });

  const totalPages = ref(1);
  const totalItems = ref(0);

  async function fetchCategories() {
    const authStore = useAuthStore();
    const businessId = authStore.user?.businessId;

    if (!businessId) {
      console.warn("No hay businessId para cargar categorías");
      return;
    }

    try {
      console.log("🔍 Buscando categorías para el negocio:", businessId);

      const fetchCategoriesFn = categoryApi.getCategories as (
        id: string,
        type: "PRODUCT" | "SERVICE",
      ) => Promise<Category[]>;

      console.log("🔍 Buscando categorías para el negocio:", businessId);

      // LOG
      const result = await fetchCategoriesFn(businessId, "PRODUCT");
      console.log("✅ Categorías recibidas del backend:", result);
      categories.value = result;
    } catch (e) {
      console.error("Error cargando categorías", e);
    }
  }

  async function fetchProducts() {
    const authStore = useAuthStore();
    const businessId = authStore.user?.businessId;

    if (!businessId) {
      console.warn("No hay businessId para cargar productos");
      return;
    }

    isLoading.value = true;
    try {
      const response = await productApi.getProducts({
        businessId: businessId,
        filters: filters.value,
      });

      //products.value = response.products;
      // ✅ FILTRADO CLAVE: Solo mostramos los productos que estén activos
      products.value = response.products.filter((p) => p.active !== false);
      totalPages.value = response.pagination.totalPages;
      totalItems.value = response.pagination.total;
    } catch (e: any) {
      error.value = e.message || "Error al cargar productos";
    } finally {
      isLoading.value = false;
    }
  }

  // async function createProduct(data: ProductFormData) {
  //   try {
  //     const newProduct = await productApi.createProduct(data);
  //     await fetchProducts(); // Refrescar la tabla
  //     return newProduct;
  //   } catch (e) {
  //     console.error("Error creando producto", e);
  //     throw e;
  //   }
  // }

  async function createProduct(data: ProductFormData) {
    const authStore = useAuthStore();
    const businessId = authStore.user?.businessId;

    if (!businessId) {
      throw new Error("No hay negocio activo para crear el producto");
    }

    try {
      const payload: CreateProductPayload = {
        ...data,
        businessId,
        purchasePrice: Number(data.purchasePrice),
        salePrice: Number(data.salePrice),
        stock: Number(data.stock),
        minStock: Number(data.minStock),
      };

      const newProduct = await productApi.createProduct(payload);
      await fetchProducts(); // Refrescar la lista
      return newProduct;
    } catch (e) {
      console.error("Error creando producto", e);
      throw e;
    }
  }

  async function updateProduct(id: string, data: ProductFormData) {
    try {
      const updated = await productApi.updateProduct(id, data);
      await fetchProducts(); // Refrescar la tabla
      return updated;
    } catch (e) {
      console.error("Error actualizando producto", e);
      throw e;
    }
  }

  async function deleteProduct(id: string) {
    try {
      await productApi.deleteProduct(id);
      await fetchProducts(); // Refrescar la tabla
    } catch (e: any) {
      console.error("Error al eliminar:", e.response?.data); // Mira la consola del navegador
      alert(e.response?.data?.message || "No se pudo eliminar el producto");
      // console.error("Error eliminando producto", e);
      // throw e;
    }
  }

  return {
    products,
    categories,
    isLoading,
    error,
    filters,
    totalPages,
    totalItems,
    fetchCategories,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});
