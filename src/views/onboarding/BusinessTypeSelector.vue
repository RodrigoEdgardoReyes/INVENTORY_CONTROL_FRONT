<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/store/onboardingStore';
import { BUSINESS_TYPES, ROUTES } from '@/config/constants';
import type { BusinessTypeValue } from '@/types/business.types';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';

const router = useRouter();
const onboardingStore = useOnboardingStore();

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
const selectedType = ref<string | null>(onboardingStore.businessType);
const errorMessage = ref('');

// ─────────────────────────────────────────
// PROGRESS STEPS
// ─────────────────────────────────────────
const progressSteps = [
  { id: 'business-type', label: 'Tipo' },
  { id: 'plans', label: 'Plan' },
  { id: 'payment', label: 'Pago' },
];

// ─────────────────────────────────────────
// COMPUTED
// ─────────────────────────────────────────
const canContinue = computed(() => !!selectedType.value);

// ─────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────
function selectType(value: BusinessTypeValue, available: boolean) {
  if (!available) {
    errorMessage.value =
      'Esta opción estará disponible próximamente. Elige otra por ahora.';
    return;
  }
  selectedType.value = value;
  errorMessage.value = '';
}

function handleContinue() {
  if (!selectedType.value) {
    errorMessage.value = 'Por favor, selecciona un tipo de negocio';
    return;
  }

  // Guardar en el store
  onboardingStore.setBusinessType(selectedType.value);

  // Redirigir al siguiente paso con query param
  router.push({
    path: ROUTES.ONBOARDING_PLANS,
    query: { type: selectedType.value },
  });
}

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
onMounted(() => {
  // Si ya había selección previa, mantenerla
  if (onboardingStore.businessType) {
    selectedType.value = onboardingStore.businessType;
  }
});
</script>

<template>
  <OnboardingLayout :current-step="1" :total-steps="3">
    <!-- PROGRESS -->
    <template #progress>
      <OnboardingProgress :current-step="1" :steps="progressSteps" />
    </template>

    <!-- HEADER -->
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900">
        ¿Para qué tipo de negocio usarás el sistema?
      </h1>
      <p class="mt-3 text-gray-600">
        Elige la opción que mejor describa tu negocio. Podrás cambiarlo más
        adelante.
      </p>
    </div>

    <!-- GRID DE TIPOS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <button
        v-for="type in BUSINESS_TYPES"
        :key="type.value"
        type="button"
        :disabled="!type.available"
        @click="selectType(type.value, type.available)"
        class="relative p-6 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        :class="{
          'border-indigo-600 bg-indigo-50 shadow-md scale-[1.02]':
            selectedType === type.value,
          'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md':
            selectedType !== type.value && type.available,
          'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed':
            !type.available,
        }"
      >
        <!-- Checkmark si está seleccionado -->
        <div
          v-if="selectedType === type.value"
          class="absolute top-3 right-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center"
        >
          <span class="text-white text-xs">✓</span>
        </div>

        <!-- Badge "Próximamente" si no está disponible -->
        <div
          v-if="!type.available"
          class="absolute top-3 right-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
        >
          Próximamente
        </div>

        <div class="text-4xl mb-3">{{ type.icon }}</div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">
          {{ type.label }}
        </h3>
        <p class="text-sm text-gray-600">{{ type.description }}</p>
      </button>
    </div>

    <!-- ERROR -->
    <div
      v-if="errorMessage"
      class="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mb-6 text-center"
    >
      {{ errorMessage }}
    </div>

    <!-- ACCIONES -->
    <div class="flex justify-between items-center">
      <router-link
        :to="ROUTES.LOGIN"
        class="text-sm text-gray-600 hover:text-gray-900"
      >
        ← Volver al inicio
      </router-link>

      <button
        type="button"
        :disabled="!canContinue"
        @click="handleContinue"
        class="px-8 py-3 rounded-lg font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        :class="{
          'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg':
            canContinue,
          'bg-gray-300 cursor-not-allowed': !canContinue,
        }"
      >
        Continuar →
      </button>
    </div>
  </OnboardingLayout>
</template>