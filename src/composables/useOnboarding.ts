// src/composables/useOnboarding.ts
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOnboardingStore } from '@/store/onboardingStore';
import { ROUTES } from '@/config/constants';

export function useOnboarding() {
  const router = useRouter();
  const store = useOnboardingStore();

  const currentStepNumber = computed(() => store.currentStep);
  const totalSteps = 3;

  function goToBusinessType() {
    router.push(ROUTES.ONBOARDING_BUSINESS_TYPE);
  }

  function goToPlans() {
    if (!store.canProceedToPlans) {
      goToBusinessType();
      return;
    }
    router.push({
      path: ROUTES.ONBOARDING_PLANS,
      query: { type: store.businessType || undefined },
    });
  }

  function goToPayment() {
    if (!store.canProceedToPayment) {
      goToPlans();
      return;
    }
    router.push({
      path: ROUTES.ONBOARDING_PAYMENT,
      query: {
        type: store.businessType || undefined,
        planId: store.selectedPlan?.id || undefined,
      },
    });
  }

  function goToDashboard() {
    store.reset();
    router.push(ROUTES.DASHBOARD);
  }

  return {
    store,
    currentStepNumber,
    totalSteps,
    goToBusinessType,
    goToPlans,
    goToPayment,
    goToDashboard,
  };
}