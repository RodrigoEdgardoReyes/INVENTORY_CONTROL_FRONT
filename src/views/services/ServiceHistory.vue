<script setup lang="ts">
import { onMounted } from 'vue';
import { useServiceStore } from '@/store/service.store';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import type { ServiceRecord } from '@/types/service.types';

const store = useServiceStore();
const authStore = useAuthStore();

onMounted(() => store.fetchServiceRecords());

// Función estrictamente tipada
const getEmployeeName = (rec: ServiceRecord) => {
  // 1. Si el backend envía el objeto employee (como vimos en el JSON)
  if (rec.employee && rec.employee.name) {
    return rec.employee.name;
  }
  // 2. Si el ID es el del usuario actual (por si acaso)
  if (rec.employeeId === authStore.user?.id) {
    return authStore.user.name;
  }
  // 3. Fallback
  return 'Barbero Desconocido';
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Historial de Servicios</h1>
      <p class="text-gray-500">Registro de servicios realizados</p>
    </div>

    <!-- Estado de Carga -->
    <div v-if="store.isLoading" class="text-center py-12 text-gray-500">
      Cargando historial...
    </div>

    <!-- Estado Vacío -->
    <div v-else-if="store.serviceRecords.length === 0" class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
      <span class="text-4xl block mb-2">📋</span>
      <p class="text-gray-500">No hay servicios registrados aún.</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
          <tr>
            <th class="px-6 py-3 font-medium">Fecha</th>
            <th class="px-6 py-3 font-medium">Servicio</th>
            <th class="px-6 py-3 font-medium">Barbero</th>
            <th class="px-6 py-3 font-medium">Cant.</th>
            <th class="px-6 py-3 font-medium">Cliente</th>
            <th class="px-6 py-3 font-medium">Precio</th>
            <th class="px-6 py-3 font-medium">Comisión</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="rec in store.serviceRecords" :key="rec.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-500">{{ formatDateTime(rec.createdAt) }}</td>
            <td class="px-6 py-4 font-medium text-gray-900">{{ rec.serviceName || 'Servicio' }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ getEmployeeName(rec) }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ rec.quantity || 1 }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ rec.clientName || 'Cliente General' }}</td>
            <td class="px-6 py-4 text-sm font-medium text-green-600">{{ formatCurrency(rec.price) }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ formatCurrency(rec.commission) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>