<!-- <script setup lang="ts">
// Placeholder - se implementará en el PASO 7
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg text-center">
      <h1 class="text-2xl font-bold mb-4">Paso 3: Pago</h1>
      <p class="text-gray-600">En construcción (PASO 7)</p>
    </div>
  </div>
</template> -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { businessApi } from '@/api';
import { ROUTES, DEFAULT_TAX_PERCENTAGES } from '@/config/constants';
import { getNextPaymentDate } from '@/utils/formatters';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout.vue';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue';
import PaymentSummary from '@/components/onboarding/PaymentSummary.vue';
import CardForm, {
  type CardFormData,
} from '@/components/onboarding/CardForm.vue';

const router = useRouter();
const route = useRoute();
const onboardingStore = useOnboardingStore();
const authStore = useAuthStore();

// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────
const cardForm = ref<CardFormData>({
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: '',
});

const isCardValid = ref(false);
const isProcessing = ref(false);
const errorMessage = ref('');
const stepMessage = ref(''); // mensaje de progreso (creando negocio, suscripción, etc.)

const cardFormRef = ref<InstanceType<typeof CardForm> | null>(null);

// ─────────────────────────────────────────
// GET data from URL + store
// ─────────────────────────────────────────
const businessType = computed(() => {
  return (route.query.type as string) || onboardingStore.businessType || '';
});

// const planId = computed(() => {
//   return (route.query.planId as string) || onboardingStore.selectedPlan?.id || '';
// });

const selectedPlan = computed(() => onboardingStore.selectedPlan);

// ─────────────────────────────────────────
// PROGRESS STEPS
// ─────────────────────────────────────────
const progressSteps = [
  { id: 'business-type', label: 'Tipo' },
  { id: 'plans', label: 'Plan' },
  { id: 'payment', label: 'Pago' },
];

// ─────────────────────────────────────────
// VALIDACIONES INICIALES
// ─────────────────────────────────────────
const canProceed = computed(() => {
  return !!selectedPlan.value && !!businessType.value && isCardValid.value;
});

// ─────────────────────────────────────────
// HANDLERS
// ─────────────────────────────────────────
function handleBack() {
  router.push({
    path: ROUTES.ONBOARDING_PLANS,
    query: { type: businessType.value },
  });
}

async function handlePay() {
  errorMessage.value = '';

  // Validaciones previas
  if (!selectedPlan.value) {
    errorMessage.value = 'No se ha seleccionado un plan';
    return;
  }

  if (!authStore.user) {
    errorMessage.value = 'Sesión no válida. Vuelve a iniciar sesión.';
    return;
  }

  // Marcar todos los campos como tocados para mostrar errores
  cardFormRef.value?.touchAll();

  if (!isCardValid.value) {
    errorMessage.value = 'Por favor, corrige los errores del formulario';
    return;
  }

  isProcessing.value = true;

  try {
    // PASO 1: Crear el negocio (con nombre temporal)
    stepMessage.value = 'Creando tu negocio...';

    // 🔑 Usamos un nombre temporal que se actualizará después
    const tempName = `Negocio de ${authStore.user.name}`;

    // const businessName =
    //   onboardingStore.businessName ||
    //   `${businessType.value.charAt(0).toUpperCase() + businessType.value.slice(1)} de ${authStore.user.name}`;

    const business = await businessApi.createBusiness({
      name: tempName,
      businessType: businessType.value,
      currency: 'USD',
      timezone: 'America/El_Salvador',
      taxPercentage: String(DEFAULT_TAX_PERCENTAGES.SV),
    });

    // ─────────────────────────────────────────
    // PASO 2: Crear la suscripción
    // ─────────────────────────────────────────
    stepMessage.value = 'Procesando el pago...';

    const monthlyPrice = parseFloat(selectedPlan.value.price);

    const subscription = await businessApi.createSubscription({
      businessId: business.id,
      planId: selectedPlan.value.id,
      monthlyPrice,
      nextPayment: getNextPaymentDate(),
      paymentStatus: 'paid',
      trialUsed: false,
    });

    console.log('✅ Suscripción creada:', subscription.id);

    // ─────────────────────────────────────────
    // PASO 3: Actualizar el store
    // ─────────────────────────────────────────
    stepMessage.value = 'Finalizando configuración...';

    // Actualizar usuario con el nuevo negocio
    authStore.updateUserBusiness(business);

    // Guardar las features del plan para los guards
    authStore.setPlanFeatures(selectedPlan.value);

    // ─────────────────────────────────────────
    // PASO 4: Limpiar onboarding y redirigir
    // ─────────────────────────────────────────

    // Guardar el businessId en el onboarding store para el sigueinte paso
    onboardingStore.setBusinessId(business.id);

    // Paso 5: Redirigir al 4to paso (nombre del negocio)

    // Pequeña pausa para que el usuario vea el mensaje
    await new Promise((resolve) => setTimeout(resolve, 600));

    // router.push(ROUTES.DASHBOARD);
    router.push(ROUTES.ONBOARDING_BUSINESS_NAME);
  } catch (error: any) {
    console.error('Error en el pago:', error);

    const status = error.response?.status;
    const backendMessage =
      error.response?.data?.message || error.response?.data?.error;

    if (status === 401) {
      errorMessage.value = 'Sesión expirada. Vuelve a iniciar sesión.';
    } else if (status === 400) {
      errorMessage.value =
        backendMessage || 'Datos inválidos. Revisa el formulario.';
    } else if (status === 409) {
      errorMessage.value =
        backendMessage || 'Ya existe un negocio con estos datos.';
    } else {
      errorMessage.value =
        backendMessage || 'Error al procesar el pago. Intenta de nuevo.';
    }
  } finally {
    isProcessing.value = false;
    stepMessage.value = '';
  }
}

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
onMounted(() => {
  // Validaciones de entrada
  if (!businessType.value) {
    router.push(ROUTES.ONBOARDING_BUSINESS_TYPE);
    return;
  }

  if (!selectedPlan.value) {
    // Si recargaron, intentamos recuperar el plan desde la URL
    // (pero no tenemos el objeto completo, así que volvemos a planes)
    router.push({
      path: ROUTES.ONBOARDING_PLANS,
      query: { type: businessType.value },
    });
    return;
  }
});
</script>

<template>
  <OnboardingLayout :current-step="3" :total-steps="3">
    <!-- PROGRESS -->
    <template #progress>
      <OnboardingProgress :current-step="3" :steps="progressSteps" />
    </template>

    <!-- HEADER -->
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-gray-900">Completa tu pago</h1>
      <p class="mt-3 text-gray-600">
        Solo falta un paso para empezar a usar tu negocio
      </p>
    </div>

    <!-- CONTENT -->
    <div v-if="selectedPlan" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- COLUMNA IZQUIERDA: FORMULARIO DE TARJETA -->
      <div>
        <CardForm
          ref="cardFormRef"
          v-model="cardForm"
          @update:is-valid="isCardValid = $event"
        />
      </div>

      <!-- COLUMNA DERECHA: RESUMEN -->
      <div class="space-y-4">
        <PaymentSummary :plan="selectedPlan" />

        <!-- BOTÓN DE PAGO -->
        <button
          type="button"
          :disabled="!canProceed || isProcessing"
          @click="handlePay"
          class="w-full py-3 rounded-lg font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :class="{
            'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg':
              canProceed && !isProcessing,
            'bg-gray-300 cursor-not-allowed': !canProceed || isProcessing,
          }"
        >
          <span v-if="isProcessing" class="flex items-center justify-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ stepMessage || 'Procesando...' }}
          </span>
          <span v-else>
            Pagar {{ selectedPlan.price }} USD y comenzar
          </span>
        </button>

        <!-- ERROR -->
        <div
          v-if="errorMessage"
          class="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
        >
          {{ errorMessage }}
        </div>

        <!-- INFO EXTRA -->
        <div class="text-xs text-gray-500 text-center space-y-1">
          <p>🔒 Pago simulado - No se realizará ningún cargo real</p>
          <p>Puedes cancelar en cualquier momento</p>
        </div>
      </div>
    </div>

    <!-- SIN PLAN SELECCIONADO -->
    <div v-else class="text-center py-16">
      <div class="text-6xl mb-4">⚠️</div>
      <p class="text-gray-600 mb-4">No hay un plan seleccionado</p>
      <button
        @click="handleBack"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Volver a planes
      </button>
    </div>

    <!-- BOTÓN ATRÁS (solo si hay plan) -->
    <div v-if="selectedPlan" class="mt-8 text-center">
      <button
        type="button"
        @click="handleBack"
        :disabled="isProcessing"
        class="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
      >
        ← Volver a planes
      </button>
    </div>
  </OnboardingLayout>
</template>