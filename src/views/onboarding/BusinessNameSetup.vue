<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout.vue';

const router = useRouter();
const onboardingStore = useOnboardingStore();
const authStore = useAuthStore();

const businessName = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const isValid = computed(() => businessName.value.trim().length >= 3);

function handleSubmit() {
  if (!isValid.value) {
    errorMessage.value = 'El nombre debe tener al menos 3 caracteres';
    return;
  }

  // Guardar el nombre en el store y en el user
  onboardingStore.setBusinessName(businessName.value.trim());

  if (authStore.user?.business) {
    authStore.user.business.name = businessName.value.trim();
    localStorage.setItem('user', JSON.stringify(authStore.user));
  }

  // Limpiar onboarding
  onboardingStore.reset();

  // Ir al dashboard
  router.push(ROUTES.DASHBOARD);
}

onMounted(() => {
  // Si no hay businessId, algo salió mal → volver al inicio
  if (!onboardingStore.createdBusinessId) {
    router.push(ROUTES.ONBOARDING_BUSINESS_TYPE);
    return;
  }

  // Pre-llenar con un nombre sugerido
  const businessType = onboardingStore.businessType || 'negocio';
  const suggestions: Record<string, string> = {
    barberia: 'Mi Barbería',
    retail: 'Mi Tienda',
    ferreteria: 'Mi Ferretería',
    zapateria: 'Mi Zapatería',
    inventario_general: 'Mi Negocio',
  };
  businessName.value = suggestions[businessType] || 'Mi Negocio';
});
</script>

<template>
  <OnboardingLayout :current-step="4" :total-steps="4">
    <div class="max-w-xl mx-auto">
      <!-- CONFETTI / ÉXITO -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🎉</div>
        <h1 class="text-3xl font-bold text-gray-900">
          ¡Pago exitoso!
        </h1>
        <p class="mt-3 text-gray-600">
          Solo falta un detalle: ¿cómo se llamará tu negocio?
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label
            for="businessName"
            class="block text-sm font-medium text-gray-700"
          >
            Nombre del negocio
          </label>
          <input
            id="businessName"
            v-model="businessName"
            type="text"
            required
            maxlength="100"
            class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
            placeholder="Ej: Barbería El Corte Perfecto"
          />
          <p class="mt-1 text-xs text-gray-500">
            Este nombre aparecerá en tus facturas y reportes
          </p>
        </div>

        <div
          v-if="errorMessage"
          class="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="!isValid || isLoading"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isLoading">Guardando...</span>
          <span v-else>Comenzar a usar el sistema →</span>
        </button>
      </form>
    </div>
  </OnboardingLayout>
</template>