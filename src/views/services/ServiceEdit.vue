<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useServiceStore } from '@/store/service.store';
import { serviceApiReal } from '@/api/service.api'; // O serviceApi según tu index
import ServiceForm from '@/components/forms/ServiceForm.vue';
import type { ServiceFormData } from '@/types/service.types';

const router = useRouter();
const route = useRoute();
const store = useServiceStore();

const initialData = ref<ServiceFormData | null>(null);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    const service = await serviceApiReal.getServiceById(id);
    
    // Convertimos el precio a número para el formulario
    initialData.value = {
      name: service.name,
      description: service.description || '',
      price: Number(service.price), 
      durationMinutes: service.durationMinutes,
      commissionRate: service.commissionRate,
      businessId: service.businessId
    };
  } catch (error) {
    alert('Servicio no encontrado');
    router.push('/services');
  }
});

const handleSubmit = async (data: ServiceFormData) => {
  try {
    const id = route.params.id as string;
    await store.updateService(id, data);
    router.push('/services');
  } catch (error) {
    alert('Error al actualizar el servicio');
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Editar Servicio</h1>
      <p class="text-gray-500">Modifica los detalles del servicio.</p>
    </div>
    
    <div v-if="initialData" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <ServiceForm 
        :initial-data="initialData" 
        :is-editing="true" 
        @submit="handleSubmit" 
        @cancel="router.push('/services')" 
      />
    </div>
    
    <div v-else class="text-center py-12 text-gray-500">
      Cargando datos del servicio...
    </div>
  </div>
</template>