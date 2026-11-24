<!-- <script setup lang="ts">
import type { TicketItem } from '@/types/service.types';
import { formatCurrency } from '@/utils/formatters';

const props = defineProps<{
  items: TicketItem[];
  employeeId: string;
  clientName: string;
  isProcessing: boolean;
}>();

const emit = defineEmits<{
  'update:employeeId': [value: string];
  'update:clientName': [value: string];
  remove: [index: number];
  checkout: [];
}>();

const total = computed(() => {
  return props.items.reduce((sum, item) => sum + (Number(item.service.price) * item.quantity), 0);
});

import { computed } from 'vue';
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col h-full sticky top-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Ticket Actual</h2>
    
    <div class="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[200px]">
      <div v-if="items.length === 0" class="text-center text-gray-400 mt-10">
        <span class="text-4xl block mb-2">✂️</span>
        <p>Selecciona servicios</p>
      </div>
      <div v-for="(item, index) in items" :key="index" class="flex justify-between items-center bg-gray-50 p-2 rounded">
        <div>
          <p class="font-medium text-sm text-gray-900">{{ item.service.name }}</p>
          <p class="text-xs text-gray-500">{{ formatCurrency(item.service.price) }} x {{ item.quantity }}</p>
        </div>
        <button @click="emit('remove', index)" class="text-red-500 hover:text-red-700 text-sm">❌</button>
      </div>
    </div>

    <!-- Selectores --
    <div class="space-y-3 mb-4 border-t pt-4">
      <div>
        <label class="block text-xs font-medium text-gray-700">Barbero (Empleado)</label>
        <select :value="employeeId" @change="emit('update:employeeId', ($event.target as HTMLSelectElement).value)" class="mt-1 w-full text-sm rounded-md border-gray-300">
          <option value="current-user">Yo mismo</option>
          <!-- Aquí irían más empleados si los hubiera --
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-700">Cliente (Opcional)</label>
        <input :value="clientName" @input="emit('update:clientName', ($event.target as HTMLInputElement).value)" type="text" placeholder="Nombre del cliente" class="mt-1 w-full text-sm rounded-md border-gray-300">
      </div>
    </div>

    <!-- Total --
    <div class="border-t pt-4">
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-600 font-medium">Total:</span>
        <span class="text-2xl font-bold text-gray-900">{{ formatCurrency(total) }}</span>
      </div>
      <button 
        @click="emit('checkout')"
        :disabled="items.length === 0 || isProcessing"
        class="w-full py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {{ isProcessing ? 'Procesando...' : 'Registrar y Cobrar' }}
      </button>
    </div>
  </div>
</template> -->





<script setup lang="ts">
import type { TicketItem } from '@/types/service.types';
import type { User } from '@/types/auth.types'; // Asegúrate de importar el tipo
import { formatCurrency } from '@/utils/formatters';
import { computed } from 'vue';

const props = defineProps<{ 
  items: TicketItem[]; 
  employeeId: string; 
  clientName: string;
  isProcessing?: boolean;
  currentUser?: User | null; // 👈 NUEVA PROP
}>();

const emit = defineEmits<{
  'update:employeeId': [value: string];
  'update:clientName': [value: string];
  remove: [index: number];
  checkout: [];
}>();

const total = computed(() => 
  props.items.reduce((sum, item) => sum + (Number(item.service.price) * item.quantity), 0)
);
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col h-full sticky top-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Ticket Actual</h2>
    
    <!-- Lista de Servicios -->
    <div class="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[200px]">
      <div v-if="items.length === 0" class="text-center text-gray-400 mt-10">
        <span class="text-4xl block mb-2">✂️</span>
        <p>Selecciona servicios</p>
      </div>
      <div v-for="(item, index) in items" :key="index" class="flex justify-between items-center bg-gray-50 p-2 rounded">
        <div>
          <p class="font-medium text-sm text-gray-900">{{ item.service.name }}</p>
          <p class="text-xs text-gray-500">{{ formatCurrency(item.service.price) }} x {{ item.quantity }}</p>
        </div>
        <button @click="emit('remove', index)" class="text-red-500 hover:text-red-700 text-sm" :disabled="isProcessing">❌</button>
      </div>
    </div>

    <!-- Selectores -->
    <div class="space-y-3 mb-4 border-t pt-4">
      <div>
        <label class="block text-xs font-medium text-gray-700">Barbero (Empleado)</label>
        <!-- ✅ CORREGIDO: Ahora usamos el UUID real -->
        <select 
          :value="employeeId" 
          @change="emit('update:employeeId', ($event.target as HTMLSelectElement).value)" 
          :disabled="isProcessing"
          class="mt-1 w-full text-sm rounded-md border-gray-300 p-2"
        >
          <option v-if="currentUser" :value="currentUser.id">Yo mismo ({{ currentUser.name }})</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-700">Cliente (Opcional)</label>
        <input 
          :value="clientName" 
          @input="emit('update:clientName', ($event.target as HTMLInputElement).value)" 
          type="text" 
          placeholder="Nombre del cliente" 
          :disabled="isProcessing"
          class="mt-1 w-full text-sm rounded-md border-gray-300 p-2"
        >
      </div>
    </div>

    <!-- Total -->
    <div class="border-t pt-4">
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-600 font-medium">Total:</span>
        <span class="text-2xl font-bold text-gray-900">{{ formatCurrency(total) }}</span>
      </div>
      <button 
        @click="emit('checkout')" 
        :disabled="items.length === 0 || isProcessing" 
        class="w-full py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {{ isProcessing ? 'Procesando...' : 'Registrar y Cobrar' }}
      </button>
    </div>
  </div>
</template>