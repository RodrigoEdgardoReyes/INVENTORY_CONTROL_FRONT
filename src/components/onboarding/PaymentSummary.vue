<script setup lang="ts">
import { computed } from 'vue';
import type { Plan } from '@/types/business.types';
import { formatCurrency, getNextPaymentDate } from '@/utils/formatters';

interface Props {
  plan: Plan;
}

const props = defineProps<Props>();

const formattedPrice = computed(() => formatCurrency(props.plan.price, 'USD'));

const nextPayment = computed(() => {
  const iso = getNextPaymentDate();
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});
</script>

<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">
      Resumen de tu suscripción
    </h3>

    <div class="space-y-3">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Plan</span>
        <span class="font-medium text-gray-900">{{ plan.name }}</span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Nivel</span>
        <span
          class="font-medium text-gray-900 px-2 py-0.5 bg-indigo-50 rounded"
        >
          {{ plan.level }}
        </span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Usuarios</span>
        <span class="font-medium text-gray-900">{{ plan.maxUsers }}</span>
      </div>

      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Sucursales</span>
        <span class="font-medium text-gray-900">
          {{ plan.maxBranches >= 999 ? 'Ilimitadas' : plan.maxBranches }}
        </span>
      </div>

      <div class="border-t border-gray-100 my-3"></div>

      <div class="flex justify-between">
        <span class="text-gray-600 font-medium">Total mensual</span>
        <span class="text-xl font-bold text-indigo-600">
          {{ formattedPrice }}
        </span>
      </div>

      <div class="flex justify-between text-xs text-gray-500">
        <span>Próximo pago</span>
        <span>{{ nextPayment }}</span>
      </div>
    </div>

    <div class="mt-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-xs text-blue-800">
        🔒 Pago seguro simulado. No se realizará ningún cargo real.
      </p>
    </div>
  </div>
</template>