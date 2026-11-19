<script setup lang="ts">
import type { Service } from '@/types/service.types';
import { formatCurrency } from '@/utils/formatters';

defineProps<{ service: Service }>();
const emit = defineEmits<{ select: [service: Service] }>();
</script>

<template>
  <button
    @click="emit('select', service)"
    class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col justify-between h-32"
  >
    <span class="font-bold text-gray-900 text-lg leading-tight">{{ service.name }}</span>
    <div class="flex justify-between items-end w-full mt-2">
      <span class="text-sm text-gray-500">{{ service.durationMinutes }} min</span>
      <span class="text-xl font-extrabold text-indigo-600">{{ formatCurrency(service.price) }}</span>
    </div>
  </button>
</template>