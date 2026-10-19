<script setup lang="ts">
import { computed } from 'vue';
import type { Plan } from '@/types/business.types';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  plan: Plan;
  selected: boolean;
  recommended?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [plan: Plan];
}>();

const formattedPrice = computed(() => {
  return formatCurrency(props.plan.price, 'USD');
});

const levelColors = computed(() => {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    LITE: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      badge: 'bg-gray-200 text-gray-700',
    },
    PRO: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      badge: 'bg-blue-200 text-blue-800',
    },
    MASTER: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      badge: 'bg-purple-200 text-purple-800',
    },
    EMPIRE: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      badge: 'bg-amber-200 text-amber-800',
    },
  };
  return colors[props.plan.level] || colors.LITE;
});

// Features a mostrar con sus labels
const featuresList = computed(() => [
  { key: 'hasProducts', label: 'Productos', enabled: props.plan.hasProducts },
  { key: 'hasServices', label: 'Servicios', enabled: props.plan.hasServices },
  { key: 'hasEntries', label: 'Entradas', enabled: props.plan.hasEntries },
  { key: 'hasExits', label: 'Salidas', enabled: props.plan.hasExits },
  { key: 'hasKardex', label: 'Kardex', enabled: props.plan.hasKardex },
  { key: 'hasFinance', label: 'Finanzas', enabled: props.plan.hasFinance },
  {
    key: 'hasCommissions',
    label: 'Comisiones',
    enabled: props.plan.hasCommissions,
  },
  { key: 'hasApiAccess', label: 'API Access', enabled: props.plan.hasApiAccess },
]);

const branchesLabel = computed(() => {
  if (props.plan.maxBranches >= 999) return 'Sucursales ilimitadas';
  if (props.plan.maxBranches === 1) return '1 sucursal';
  return `${props.plan.maxBranches} sucursales`;
});

function handleSelect() {
  emit('select', props.plan);
}
</script>

<template>
  <div
    class="relative flex flex-col rounded-xl border-2 transition-all duration-200 overflow-hidden"
    :class="{
      'border-indigo-600 shadow-lg scale-[1.02]': selected,
      'border-gray-200 hover:border-indigo-300 hover:shadow-md': !selected,
    }"
  >
    <!-- BADGE RECOMENDADO -->
    <div
      v-if="recommended"
      class="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg"
    >
      ⭐ Recomendado
    </div>

    <!-- BADGE SELECCIONADO -->
    <div
      v-if="selected"
      class="absolute top-3 left-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"
    >
      <span class="text-white text-xs">✓</span>
    </div>

    <!-- HEADER -->
    <div class="p-6 pb-4" :class="levelColors.bg">
      <div class="flex items-center justify-between mb-2">
        <span
          class="text-xs font-semibold px-2 py-1 rounded-full"
          :class="levelColors.badge"
        >
          {{ plan.level }}
        </span>
      </div>

      <h3 class="text-xl font-bold text-gray-900 mb-1">
        {{ plan.name }}
      </h3>
      <p class="text-sm text-gray-600 min-h-[2.5rem]">
        {{ plan.description }}
      </p>

      <div class="mt-4 flex items-baseline">
        <span class="text-3xl font-bold text-gray-900">
          {{ formattedPrice }}
        </span>
        <span class="text-sm text-gray-500 ml-1">/mes</span>
      </div>
    </div>

    <!-- FEATURES -->
    <div class="flex-1 p-6 pt-4 space-y-3">
      <!-- Usuarios -->
      <div class="flex items-center text-sm">
        <span class="text-green-600 mr-2">👥</span>
        <span class="text-gray-700">
          Hasta <strong>{{ plan.maxUsers }}</strong> usuarios
        </span>
      </div>

      <!-- Sucursales -->
      <div class="flex items-center text-sm">
        <span class="text-green-600 mr-2">🏢</span>
        <span class="text-gray-700">{{ branchesLabel }}</span>
      </div>

      <!-- Divisor -->
      <div class="border-t border-gray-100 my-3"></div>

      <!-- Features -->
      <div
        v-for="feature in featuresList"
        :key="feature.key"
        class="flex items-center text-sm"
      >
        <span
          class="mr-2 font-bold"
          :class="feature.enabled ? 'text-green-600' : 'text-gray-300'"
        >
          {{ feature.enabled ? '✓' : '✗' }}
        </span>
        <span
          :class="
            feature.enabled
              ? 'text-gray-700'
              : 'text-gray-400 line-through'
          "
        >
          {{ feature.label }}
        </span>
      </div>
    </div>

    <!-- BOTÓN -->
    <div class="p-6 pt-0">
      <button
        type="button"
        @click="handleSelect"
        class="w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        :class="{
          'bg-indigo-600 text-white hover:bg-indigo-700': selected,
          'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50':
            !selected,
        }"
      >
        {{ selected ? '✓ Seleccionado' : 'Elegir plan' }}
      </button>
    </div>
  </div>
</template>