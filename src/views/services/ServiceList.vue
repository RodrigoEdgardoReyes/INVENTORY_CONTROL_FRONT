<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceStore } from '@/store/service.store';
import { formatCurrency } from '@/utils/formatters';

const router = useRouter();
const store = useServiceStore();

onMounted(() => store.fetchServices());

const handleDelete = async (id: string) => {
  if (confirm('¿Eliminar servicio?')) await store.deleteService(id);
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Catálogo de Servicios</h1>
      <div class="space-x-2">
        <button @click="router.push('/services/register')" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
          ⚡ Modo Rápido
        </button>
        <button @click="router.push('/services/create')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
          + Nuevo Servicio
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
          <tr>
            <th class="px-6 py-3 font-medium">Servicio</th>
            <th class="px-6 py-3 font-medium">Duración</th>
            <th class="px-6 py-3 font-medium">Precio</th>
            <th class="px-6 py-3 font-medium">Comisión</th>
            <th class="px-6 py-3 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="srv in store.services" :key="srv.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 font-medium text-gray-900">{{ srv.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ srv.durationMinutes }} min</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ formatCurrency(srv.price) }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ srv.commissionRate }}%</td>
            <td class="px-6 py-4 text-sm text-right space-x-2">
              <button class="text-indigo-600 hover:text-indigo-900">Editar</button>
              <button @click="handleDelete(srv.id)" class="text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>