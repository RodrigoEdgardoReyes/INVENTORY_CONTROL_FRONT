<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useServiceStore } from '@/store/service.store';
import ServiceForm from '@/components/forms/ServiceForm.vue';
import type { ServiceFormData } from '@/types/service.types';

const router = useRouter();
const store = useServiceStore();

const handleSubmit = async (data: ServiceFormData) => {
  try {
    await store.createService(data);
    router.push('/services');
  } catch (error) {
    alert('Error al crear el servicio');
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Nuevo Servicio</h1>
      <p class="text-gray-500">Agrega un nuevo servicio a tu catálogo (Ej: Corte, Barba, Tinte).</p>
    </div>
    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <ServiceForm @submit="handleSubmit" @cancel="router.push('/services')" />
    </div>
  </div>
</template>