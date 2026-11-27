<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSaleStore } from '@/store/sale.store';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import type { Sale } from '@/types/sale.types';

const route = useRoute();
const router = useRouter();
const saleStore = useSaleStore();
const authStore = useAuthStore();

const sale = ref<Sale | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    sale.value = await saleStore.fetchSaleById(id);
  } catch (error) {
    alert('No se pudo cargar la venta');
    router.push('/sales');
  } finally {
    isLoading.value = false;
  }
});

const getProductName = (item: any) => {
  if (item.productName) return item.productName;
  if (item.product) return item.product.name;
  return 'Producto Desconocido';
};

const handlePrint = () => {
  window.print();
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header de navegación -->
    <div class="flex justify-between items-center print:hidden">
      <button @click="router.push('/sales')" class="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
        <span>←</span> <span>Volver a Ventas</span>
      </button>
      <button @click="handlePrint" class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium">
        🖨️ Imprimir Factura
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-gray-500">
      Cargando detalle de la venta...
    </div>

    <!-- Factura / Detalle -->
    <div v-else-if="sale" class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border-none">
      
      <!-- Cabecera de la Factura -->
      <div class="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">FACTURA</h1>
          <p class="text-gray-500 mt-1">Ref: {{ sale.invoiceNumber || sale.id.slice(0, 8).toUpperCase() }}</p>
          <p class="text-gray-500 text-sm mt-1">Fecha: {{ formatDateTime(sale.createdAt) }}</p>
        </div>
        <div class="text-right">
          <h2 class="text-xl font-bold text-indigo-600">{{ authStore.user?.business?.name }}</h2>
          <p class="text-sm text-gray-500">NIT: {{ authStore.user?.business?.taxPercentage }}% IVA</p>
        </div>
      </div>

      <!-- Datos del Cliente -->
      <div class="mb-8">
        <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Información del Cliente</h3>
        <p class="text-lg font-medium text-gray-900">{{ sale.clientName }}</p>
        <p v-if="sale.clientNit" class="text-sm text-gray-600">NIT/Doc: {{ sale.clientNit }}</p>
        <p class="text-sm text-gray-600">Método de Pago: 
          <span class="font-medium">{{ sale.paymentMethod === 'CASH' ? 'Efectivo' : sale.paymentMethod === 'CARD' ? 'Tarjeta' : 'Transferencia' }}</span>
        </p>
      </div>

      <!-- Tabla de Productos -->
      <table class="w-full text-left border-collapse mb-8">
        <thead class="bg-gray-50 border-y text-sm text-gray-500">
          <tr>
            <th class="py-3 px-2 font-medium">Producto</th>
            <th class="py-3 px-2 font-medium text-center">Cant.</th>
            <th class="py-3 px-2 font-medium text-right">Precio Unit.</th>
            <th class="py-3 px-2 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="item in sale.details" :key="item.id">
            <td class="py-4 px-2 font-medium text-gray-900">{{ getProductName(item) }}</td>
            <td class="py-4 px-2 text-center text-gray-700">{{ item.quantity }}</td>
            <td class="py-4 px-2 text-right text-gray-700">{{ formatCurrency(Number(item.unitPrice)) }}</td>
            <td class="py-4 px-2 text-right font-medium text-gray-900">{{ formatCurrency(Number(item.total)) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totales -->
      <div class="flex justify-end border-t pt-6">
        <div class="w-64 space-y-3">
          <div class="flex justify-between text-sm text-gray-600">
            <span>Subtotal:</span>
            <span>{{ formatCurrency(Number(sale.subtotal)) }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-600">
            <span>IVA:</span>
            <span>{{ formatCurrency(Number(sale.tax)) }}</span>
          </div>
          <div class="flex justify-between text-xl font-extrabold text-gray-900 border-t pt-3">
            <span>Total:</span>
            <span>{{ formatCurrency(Number(sale.total)) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Footer de la factura -->
      <div class="mt-12 text-center text-xs text-gray-400">
        <p>¡Gracias por su compra!</p>
        <p>Generado por {{ authStore.user?.business?.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  body {
    background-color: white;
  }
  /* Ocultar barra lateral y header al imprimir */
  :global(.no-print) { display: none !important; }
}
</style>