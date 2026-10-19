<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">Historial de Movimientos (Kardex)</h2>

    <!-- Filtros -->
    <AppCard>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AppInput v-model="filters.startDate" label="Fecha Inicio" type="date" />
        <AppInput v-model="filters.endDate" label="Fecha Fin" type="date" />
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            v-model="filters.type"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Todos</option>
            <option value="ENTRY">Entradas</option>
            <option value="EXIT">Salidas</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
          <select
            v-model="filters.productId"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Todos los productos</option>
            <option v-for="product in productsList" :key="product.id" :value="product.id">
              {{ product.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <AppButton variant="primary" @click="applyFilters">
          Aplicar Filtros
        </AppButton>
      </div>
    </AppCard>

    <!-- Tabla de Movimientos -->
    <AppCard :loading="loading">
      <AppTable
        :columns="columns"
        :data="filteredMovements"
      >
        <template #cell-type="{ row }">
          <AppBadge :variant="row.type === 'ENTRY' ? 'success' : 'danger'">
            {{ row.type === 'ENTRY' ? 'ENTRADA' : 'SALIDA' }}
          </AppBadge>
        </template>
        <template #cell-total="{ row }">
          <span :class="row.type === 'ENTRY' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'">
            ${{ Number(row.total).toFixed(2) }}
          </span>
        </template>
      </AppTable>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="flex justify-between items-center mt-4 pt-4 border-t">
        <div class="text-sm text-gray-600">
          Página {{ currentPage }} de {{ totalPages }} ({{ totalItems }} registros)
        </div>
        <div class="flex space-x-2">
          <AppButton
            variant="secondary"
            size="sm"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            ← Anterior
          </AppButton>
          <AppButton
            variant="secondary"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Siguiente →
          </AppButton>
        </div>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiClient from '../../config/axios';
import AppCard from '../../components/common/AppCard.vue';
import AppTable from '../../components/common/AppTable.vue';
import AppButton from '../../components/common/AppButton.vue';
import AppBadge from '../../components/common/AppBadge.vue';
import AppInput from '../../components/common/AppInput.vue';

interface Movement {
  id: string;
  type: 'ENTRY' | 'EXIT';
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  reason: string;
  reference: string;
  userName: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
}

const route = useRoute();
const loading = ref(false);
const movements = ref<Movement[]>([]);
const productsList = ref<Product[]>([]);
const currentPage = ref(1);
const pageSize = 10;

const filters = reactive({
  startDate: '',
  endDate: '',
  type: '' as string,
  productId: (route.query.product as string) || ''
});

const columns = [
  { key: 'date', label: 'Fecha' },
  { key: 'type', label: 'Tipo' },
  { key: 'productName', label: 'Producto' },
  { key: 'quantity', label: 'Cantidad' },
  { key: 'unitPrice', label: 'Precio Unit.' },
  { key: 'total', label: 'Total' },
  { key: 'reason', label: 'Motivo' },
  { key: 'reference', label: 'Referencia' },
  { key: 'userName', label: 'Usuario' }
];

const filteredMovements = computed(() => {
  let result = movements.value;

  if (filters.startDate) {
    result = result.filter(m => m.date >= filters.startDate);
  }
  if (filters.endDate) {
    result = result.filter(m => m.date <= filters.endDate);
  }
  if (filters.type) {
    result = result.filter(m => m.type === filters.type);
  }
  if (filters.productId) {
    result = result.filter(m => m.productId === filters.productId);
  }

  const start = (currentPage.value - 1) * pageSize;
  return result.slice(start, start + pageSize);
});

const totalItems = computed(() => {
  let result = movements.value;
  if (filters.startDate) result = result.filter(m => m.date >= filters.startDate);
  if (filters.endDate) result = result.filter(m => m.date <= filters.endDate);
  if (filters.type) result = result.filter(m => m.type === filters.type);
  if (filters.productId) result = result.filter(m => m.productId === filters.productId);
  return result.length;
});

const totalPages = computed(() => Math.ceil(totalItems.value / pageSize));

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function applyFilters() {
  currentPage.value = 1;
  fetchMovements();
}

async function fetchMovements() {
  loading.value = true;
  try {
    const params: any = {};
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.type) params.type = filters.type;
    if (filters.productId) params.productId = filters.productId;

    const response = await apiClient.get('/movements', { params });
    movements.value = response.data;
  } catch (error) {
    console.error('Error fetching movements:', error);
    // Datos de ejemplo para desarrollo
    movements.value = [
      {
        id: '1',
        type: 'ENTRY' as const,
        productId: '1',
        productName: 'Producto A',
        quantity: 50,
        unitPrice: 10.00,
        total: 500.00,
        reason: 'Compra',
        reference: 'Prov-001',
        userName: 'Admin',
        date: '2024-01-15'
      },
      {
        id: '2',
        type: 'EXIT' as const,
        productId: '2',
        productName: 'Producto B',
        quantity: 5,
        unitPrice: 25.00,
        total: 125.00,
        reason: 'Venta',
        reference: 'Cliente-001',
        userName: 'Admin',
        date: '2024-01-14'
      }
    ];
  } finally {
    loading.value = false;
  }
}

async function fetchProducts() {
  try {
    const response = await apiClient.get('/products');
    productsList.value = response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    productsList.value = [];
  }
}

onMounted(() => {
  fetchMovements();
  fetchProducts();
});
</script>