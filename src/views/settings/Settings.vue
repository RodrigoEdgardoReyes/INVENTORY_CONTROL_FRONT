<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/authStore';

const authStore = useAuthStore();

const form = ref({
  businessName: '',
  currency: 'USD',
  timezone: 'America/El_Salvador',
  taxPercentage: '13',
});

onMounted(() => {
  if (authStore.user?.business) {
    form.value.businessName = authStore.user.business.name;
    form.value.currency = authStore.user.business.currency || 'USD';
    form.value.timezone = authStore.user.business.timezone || 'America/El_Salvador';
    form.value.taxPercentage = authStore.user.business.taxPercentage || '13';
  }
});

const handleSave = () => {
  // Aquí iría la llamada a la API PUT /business/:id
  alert('Configuración guardada (Simulado). En la siguiente fase se conecta al backend.');
};
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Configuración</h1>
      <p class="text-gray-500">Administra los datos de tu negocio.</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Perfil del Negocio</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
          <input v-model="form.businessName" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Moneda</label>
          <select v-model="form.currency" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
            <option value="USD">Dólar (USD)</option>
            <option value="MXN">Peso Mexicano (MXN)</option>
            <option value="COP">Peso Colombiano (COP)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Zona Horaria</label>
          <select v-model="form.timezone" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
            <option value="America/El_Salvador">El Salvador (GMT-6)</option>
            <option value="America/Mexico_City">México (GMT-6)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Porcentaje de IVA (%)</label>
          <input v-model="form.taxPercentage" type="number" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button @click="handleSave" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Guardar Cambios</button>
      </div>
    </div>
  </div>
</template>