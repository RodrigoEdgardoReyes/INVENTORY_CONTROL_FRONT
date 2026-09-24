import type { Plan, BusinessTypeValue } from './business.types';

/**
 * Estado del flujo de onboarding (se guarda en el store)
 */
export interface OnboardingState {
  businessType: BusinessTypeValue | string | null;
  businessName: string | null;
  selectedPlan: Plan | null;
  paymentCompleted: boolean;
}

/**
 * Pasos del onboarding (para indicador de progreso)
 */
export type OnboardingStep = 'business-type' | 'plans' | 'payment';

export interface OnboardingStepInfo {
  id: OnboardingStep;
  label: string;
  description: string;
}

export const ONBOARDING_STEPS: OnboardingStepInfo[] = [
  {
    id: 'business-type',
    label: 'Tipo de negocio',
    description: '¿Para qué tipo de negocio usarás el sistema?',
  },
  {
    id: 'plans',
    label: 'Plan',
    description: 'Selecciona el plan ideal para ti',
  },
  {
    id: 'payment',
    label: 'Pago',
    description: 'Completa tu suscripción',
  },
];