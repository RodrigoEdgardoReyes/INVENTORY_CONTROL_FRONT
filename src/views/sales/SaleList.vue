<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSaleStore } from '@/store/sale.store';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

const router = useRouter();
const saleStore = useSaleStore();

onMounted(() => {
  saleStore.fetchSales();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Ventas</h1>
      <button @click="router.push('/sales/create')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
        + Nueva Venta
      </button>
    </div>

    <div v-if="saleStore.isLoading" class="text-center py-12 text-gray-500">
      Cargando ventas...
    </div>

    <div v-else-if="saleStore.sales.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
      <span class="text-4xl block mb-2">🛒</span>
      <p class="text-gray-500">No hay ventas registradas aún.</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b text-sm text-gray-500">
          <tr>
            <th class="px-6 py-3 font-medium">Fecha</th>
            <th class="px-6 py-3 font-medium">Factura</th>
            <th class="px-6 py-3 font-medium">Cliente</th>
            <th class="px-6 py-3 font-medium">Método</th>
            <th class="px-6 py-3 font-medium">Total</th>
            <th class="px-6 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="sale in saleStore.sales" :key="sale.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-500">{{ formatDateTime(sale.createdAt) }}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ sale.invoiceNumber || sale.id.slice(0, 8) }}</td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ sale.clientName }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ sale.paymentMethod === 'CASH' ? 'Efectivo' : sale.paymentMethod === 'CARD' ? 'Tarjeta' : 'Transferencia' }}
            </td>
            <td class="px-6 py-4 text-sm font-bold text-green-600">{{ formatCurrency(sale.total) }}</td>
            <td class="px-6 py-4 text-sm">
              <button class="text-indigo-600 hover:text-indigo-900 font-medium">Ver Detalle</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>