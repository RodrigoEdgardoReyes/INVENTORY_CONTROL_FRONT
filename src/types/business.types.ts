import type { Business } from './auth.types';

export type PlanLevel = 'LITE' | 'PRO' | 'MASTER' | 'EMPIRE';

export type BusinessTypeValue =
  | 'inventario_general'
  | 'barberia'
  | 'ferreteria'
  | 'zapateria'
  | 'retail'
  | 'otro';

/**
 * Plan de suscripción
 */
export interface Plan {
  id: string;
  name: string;
  businessType: BusinessTypeValue | string;
  level: PlanLevel;
  price: string; // ⚠️ Viene como string desde el backend
  description: string;
  features: Record<string, unknown>; // objeto vacío actualmente
  maxUsers: number;
  maxBranches: number;
  hasProducts: boolean;
  hasEntries: boolean;
  hasExits: boolean;
  hasServices: boolean;
  hasKardex: boolean;
  hasFinance: boolean;
  hasCommissions: boolean;
  hasApiAccess: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  _count?: {
    subscriptions: number;
  };
}

/**
 * Respuesta paginada de planes
 */
export interface PlansResponse {
  plans: Plan[];
}

/**
 * Payload para crear negocio
 */
export interface CreateBusinessPayload {
  name: string;
  businessType: BusinessTypeValue | string;
  currency?: string;
  timezone?: string;
  taxPercentage?: string;
}

/**
 * Suscripción activa del negocio
 */
export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  level: PlanLevel;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  features: string[];
}

/**
 * Payload de pago (simulado/fake)
 */
export interface PaymentPayload {
  planId: string;
  businessId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface PaymentResponse {
  success: boolean;
  subscription?: Subscription;
  message?: string;
}

/**
 * Tipo de negocio soportado
 */
export interface BusinessType {
  id: string;
  name: string;
  value: BusinessTypeValue;
  icon: string;
  description: string;
  available: boolean;
}

export type { Business };