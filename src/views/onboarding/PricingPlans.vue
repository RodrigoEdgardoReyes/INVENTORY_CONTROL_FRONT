<!-- <script setup lang="ts">
// Placeholder - se implementará en el PASO 6
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg text-center">
      <h1 class="text-2xl font-bold mb-4">Paso 2: Planes</h1>
      <p class="text-gray-600">En construcción (PASO 6)</p>
    </div>
  </div>
</template> -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOnboardingStore } from '@/store/onboardingStore';
import { businessApi } from '@/api';
import { ROUTES } from '@/config/constants';
import type { Plan } from '@/types/business.types';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';
import PlanCard from '@/components/onboarding/PlanCard.vue';

const router = useRouter();
const route = useRoute();
const onboardingStore = useOnboardingStore();

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
const plans = ref<Plan[]>([]);
const selectedPlan = ref<Plan | null>(onboardingStore.selectedPlan);
const isLoading = ref(false);
const errorMessage = ref('');

// ─────────────────────────────────────────
// GET businessType from URL (query param)
// ─────────────────────────────────────────
const businessType = computed(() => {
  return (route.query.type as string) || onboardingStore.businessType || '';
});

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
const canContinue = computed(() => !!selectedPlan.value);

const businessTypeLabel = computed(() => {
  const labels: Record<string, string> = {
    barberia: 'Barbería',
    retail: 'Tienda / Retail',
    ferreteria: 'Ferretería',
    zapateria: 'Zapatería',
    inventario_general: 'Inventario General',
  };
  return labels[businessType.value] || businessType.value;
});

// ─────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────
function handleSelectPlan(plan: Plan) {
  selectedPlan.value = plan;
  errorMessage.value = '';
}

function handleContinue() {
  if (!selectedPlan.value) {
    errorMessage.value = 'Por favor, selecciona un plan';
    return;
  }

  // Guardar en el store
  onboardingStore.setSelectedPlan(selectedPlan.value);

  // Redirigir al siguiente paso
  router.push({
    path: ROUTES.ONBOARDING_PAYMENT,
    query: {
      type: businessType.value,
      planId: selectedPlan.value.id,
    },
  });
}

function handleBack() {
  router.push(ROUTES.ONBOARDING_BUSINESS_TYPE);
}

// ─────────────────────────────────────────
// LOAD PLANS
// ─────────────────────────────────────────
async function loadPlans() {
  if (!businessType.value) {
    router.push(ROUTES.ONBOARDING_BUSINESS_TYPE);
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const fetchedPlans = await businessApi.getPlansByType(businessType.value);
    plans.value = fetchedPlans;

    // Restaurar plan seleccionado si existe (útil al recargar)
    onboardingStore.restoreSelectedPlanFromList(fetchedPlans);
    if (onboardingStore.selectedPlan) {
      selectedPlan.value = onboardingStore.selectedPlan;
    }

    if (fetchedPlans.length === 0) {
      errorMessage.value =
        'No hay planes disponibles para este tipo de negocio';
    }
  } catch (error: any) {
    console.error('Error al cargar planes:', error);
    errorMessage.value =
      error.response?.data?.message ||
      'Error al cargar los planes. Intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
}

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
onMounted(() => {
  loadPlans();
});
</script>

<template>
  <OnboardingLayout :current-step="2" :total-steps="3">
    <!-- PROGRESS -->
    <template #progress>
      <OnboardingProgress :current-step="2" :steps="progressSteps" />
    </template>

    <!-- HEADER -->
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900">
        Elige tu plan para {{ businessTypeLabel }}
      </h1>
      <p class="mt-3 text-gray-600">
        Puedes cambiarlo más adelante desde la configuración
      </p>
    </div>

    <!-- LOADING -->
    <div v-if="isLoading" class="text-center py-16">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
      ></div>
      <p class="mt-4 text-gray-600">Cargando planes...</p>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="errorMessage && plans.length === 0"
      class="text-center py-16"
    >
      <div class="text-6xl mb-4">😕</div>
      <p class="text-red-600 mb-4">{{ errorMessage }}</p>
      <button
        @click="loadPlans"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Reintentar
      </button>
    </div>

    <!-- PLANS GRID -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <PlanCard
          v-for="(plan, index) in plans"
          :key="plan.id"
          :plan="plan"
          :selected="selectedPlan?.id === plan.id"
          :recommended="index === 1"
          @select="handleSelectPlan"
        />
      </div>

      <!-- ERROR GLOBAL -->
      <div
        v-if="errorMessage"
        class="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 mb-6 text-center"
      >
        {{ errorMessage }}
      </div>

      <!-- ACCIONES -->
      <div class="flex justify-between items-center">
        <button
          type="button"
          @click="handleBack"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Volver
        </button>

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
    </div>
  </OnboardingLayout>
</template>