// src/store/product.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Product } from '@/types/product.types';

export const useProductsStore = defineStore('products', () => {
  // ─────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────
  const products = ref<Product[]>([
    {
      id: '1',                          // ← string, no number
      sku: 'HP-001',
      name: 'Laptop HP',
      category: 'Electrónicos',
      description: 'Laptop 16GB RAM',
      stock: 15,
      minStock: 5,
      purchasePrice: 700,
      salePrice: 899.99,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      active: true,
    },
    {
      id: '2',
      sku: 'LG-002',
      name: 'Mouse Logitech',
      category: 'Periféricos',
      stock: 45,
      minStock: 10,
      purchasePrice: 20,
      salePrice: 29.99,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-16'),
      active: true,
    },
    {
      id: '3',
      sku: 'SM-003',
      name: 'Monitor Samsung',
      category: 'Electrónicos',
      stock: 8,
      minStock: 5,
      purchasePrice: 250,
      salePrice: 299.99,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-17'),
      active: true,
    },
  ]);

  const loading = ref(false);
  const searchQuery = ref('');
  const categoryFilter = ref('');

  // ─────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────
  const categories = computed(() => {
    const cats = new Set(products.value.map((p) => p.category));
    return Array.from(cats);
  });

  const filteredProducts = computed(() => {
    let result = products.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query)
      );
    }

    if (categoryFilter.value) {
      result = result.filter((p) => p.category === categoryFilter.value);
    }

    return result;
  });

  // ─────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────
  const fetchProducts = async () => {
    loading.value = true;
    // Simular API
    await new Promise((resolve) => setTimeout(resolve, 500));
    loading.value = false;
  };

  const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newProduct: Product = {
      ...product,
      id: String(products.value.length + 1),  // ← string
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    };

    products.value.push(newProduct);
    loading.value = false;
    return true;
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    loading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = products.value.findIndex((p) => p.id === id);
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        ...product,
        updatedAt: new Date(),  // ← actualizar fecha
      };
    }

    loading.value = false;
    return true;
  };

  return {
    products,
    loading,
    searchQuery,
    categoryFilter,
    categories,
    filteredProducts,
    fetchProducts,
    createProduct,
    updateProduct,
  };
});