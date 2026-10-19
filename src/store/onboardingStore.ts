// src/store/onboarding.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Plan, BusinessTypeValue } from '@/types/business.types';

const STORAGE_KEY = 'onboarding_state';

interface PersistedState {
  businessType: string | null;
  businessName: string | null;
  selectedPlanId: string | null;
  currentStep: number;
  createdBusinessId: string | null;
}

export const useOnboardingStore = defineStore('onboarding', () => {
  // ─────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────
  const businessType = ref<string | null>(null);
  const businessName = ref<string | null>(null);
  const selectedPlan = ref<Plan | null>(null);
  const currentStep = ref(1); // 1: tipo, 2: plan, 3: pago
  const isProcessing = ref(false);
  const error = ref<string | null>(null);
  const createdBusinessId = ref<string | null>(null);

  // ─────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────
  const hasBusinessType = computed(() => !!businessType.value);
  const hasSelectedPlan = computed(() => !!selectedPlan.value);
  const canProceedToPlans = computed(() => hasBusinessType.value);
  const canProceedToPayment = computed(
    () => hasBusinessType.value && hasSelectedPlan.value
  );

  const isComplete = computed(
    () => hasBusinessType.value && hasSelectedPlan.value && !!businessName.value
  );

  const selectedPlanPrice = computed(() => {
    if (!selectedPlan.value) return 0;
    return parseFloat(selectedPlan.value.price);
  });

  // ─────────────────────────────────────────
  // PERSISTENCIA
  // ─────────────────────────────────────────
  function persist() {
    const state: PersistedState = {
      businessType: businessType.value,
      businessName: businessName.value,
      selectedPlanId: selectedPlan.value?.id || null,
      currentStep: currentStep.value,
      createdBusinessId: createdBusinessId.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function restore() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const state: PersistedState = JSON.parse(raw);
      businessType.value = state.businessType;
      businessName.value = state.businessName;
      currentStep.value = state.currentStep || 1;
      createdBusinessId.value = state.createdBusinessId || null;
      // Nota: selectedPlan se restaura cuando se cargue la lista de planes
      // y se haga match con selectedPlanId
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // ─────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────
  function setBusinessType(type: BusinessTypeValue | string) {
    businessType.value = type;
    currentStep.value = 2;
    persist();
  }

  function setSelectedPlan(plan: Plan) {
    selectedPlan.value = plan;
    currentStep.value = 3;
    persist();
  }

  function setBusinessName(name: string) {
    businessName.value = name;
    persist();
  }

  function setBusinessId(id: string) {
    createdBusinessId.value = id;
    persist();
  }

  /**
   * Restaura el plan seleccionado desde la lista (útil al recargar)
   * Se llama desde PricingPlans.vue cuando carga los planes
   */
  function restoreSelectedPlanFromList(plans: Plan[]) {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const state: PersistedState = JSON.parse(raw);
      if (state.selectedPlanId) {
        const found = plans.find((p) => p.id === state.selectedPlanId);
        if (found) {
          selectedPlan.value = found;
        }
      }
    } catch {
      // Silencioso
    }
  }

  function goToStep(step: number) {
    currentStep.value = Math.max(1, Math.min(3, step));
    persist();
  }

  function reset() {
    businessType.value = null;
    businessName.value = null;
    selectedPlan.value = null;
    currentStep.value = 1;
    isProcessing.value = false;
    error.value = null;
    createdBusinessId.value = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  // ─────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────
  restore();

  // ─────────────────────────────────────────
  // EXPORTS
  // ─────────────────────────────────────────
  return {
    // state
    businessType,
    businessName,
    selectedPlan,
    currentStep,
    isProcessing,
    error,
    createdBusinessId,

    // getters
    hasBusinessType,
    hasSelectedPlan,
    canProceedToPlans,
    canProceedToPayment,
    isComplete,
    selectedPlanPrice,

    // actions
    setBusinessType,
    setSelectedPlan,
    setBusinessName,
    setBusinessId,
    restoreSelectedPlanFromList,
    goToStep,
    reset,
    persist,
    restore,
  };
});