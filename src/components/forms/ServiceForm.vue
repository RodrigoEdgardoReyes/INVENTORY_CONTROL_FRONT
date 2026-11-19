<script setup lang="ts">
import { ref } from 'vue';
import type { ServiceFormData } from '@/types/service.types';

const props = defineProps<{
  initialData?: Partial<ServiceFormData>;
  isEditing?: boolean;
}>();

const emit = defineEmits<{
  submit: [data: ServiceFormData];
  cancel: [];
}>();

const form = ref<ServiceFormData>({
  name: '',
  description: '',
  price: 0,
  durationMinutes: 30,
  commissionRate: 0,
  ...props.initialData
});

const handleSubmit = () => {
  emit('submit', form.value);
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre del Servicio *</label>
        <input v-model="form.name" required type="text" placeholder="Ej: Corte de cabello" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Precio de Venta *</label>
        <input v-model.number="form.price" required type="number" step="0.01" min="0" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Duración (minutos) *</label>
        <input v-model.number="form.durationMinutes" required type="number" min="1" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Comisión (%) *</label>
        <input v-model.number="form.commissionRate" required type="number" min="0" max="100" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
        <p class="mt-1 text-xs text-gray-500">Porcentaje que gana el empleado por este servicio.</p>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Descripción (Opcional)</label>
      <textarea v-model="form.description" rows="3" class="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
      <button type="button" @click="emit('cancel')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
      <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        {{ isEditing ? 'Guardar Cambios' : 'Crear Servicio' }}
      </button>
    </div>
  </form>
</template>