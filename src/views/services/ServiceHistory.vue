<script setup lang="ts">
import { onMounted } from 'vue';
import { useServiceStore } from '@/store/service.store';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

const store = useServiceStore();
onMounted(() => store.fetchServiceRecords());
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Historial de Servicios</h1>
      <p class="text-gray-500">Registro de servicios realizados</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
          <tr>
            <th class="px-6 py-3 font-medium">Fecha</th>
            <th class="px-6 py-3 font-medium">Servicio</th>
            <th class="px-6 py-3 font-medium">Cliente</th>
            <th class="px-6 py-3 font-medium">Precio</th>
            <th class="px-6 py-3 font-medium">Comisión</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="rec in store.serviceRecords" :key="rec.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-500">{{ formatDateTime(rec.createdAt) }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ rec.serviceName || 'Servicio' }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ rec.clientName || 'Cliente General' }}</td>
            <td class="px-6 py-4 text-sm font-medium text-green-600">{{ formatCurrency(rec.price) }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ formatCurrency(rec.commissionAmount) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>