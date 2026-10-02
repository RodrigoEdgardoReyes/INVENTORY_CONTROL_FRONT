// src/api/business.api.ts
import apiClient from '@/config/axios';
import type { ApiResponse } from '@/types/common.types';
import type {
  Plan,
  PlansResponse,
  CreateBusinessPayload,
} from '@/types/business.types';
import type { Business } from '@/types/auth.types';

// ─────────────────────────────────────────────
// Respuesta específica de crear negocio
// ─────────────────────────────────────────────
interface CreateBusinessResponse {
  business: Business;
}

// ─────────────────────────────────────────────
// Payload de crear suscripción
// ─────────────────────────────────────────────
export interface CreateSubscriptionPayload {
  businessId: string;
  planId: string;
  monthlyPrice: number;
  nextPayment: string; // ISO date
  paymentStatus: 'paid' | 'pending' | 'failed';
  trialUsed: boolean;
}

interface CreateSubscriptionResponse {
  subscription: {
    id: string;
    businessId: string;
    planId: string;
    monthlyPrice: number;
    paymentStatus: string;
    active: boolean;
  };
}

// ─────────────────────────────────────────────
// Implementación REAL contra el backend
// ─────────────────────────────────────────────
export const businessApiReal = {
  /**
   * Obtener planes filtrados por tipo de negocio
   * GET /plans/type/:businessType
   */
  async getPlansByType(businessType: string): Promise<Plan[]> {
    const { data } = await apiClient.get<ApiResponse<PlansResponse>>(
      `/plans/type/${businessType}`
    );
    return data.data.plans;
  },

  /**
   * Obtener todos los planes
   * GET /plans
   */
  async getAllPlans(): Promise<Plan[]> {
    const { data } = await apiClient.get<ApiResponse<PlansResponse>>('/plans');
    return data.data.plans;
  },

  /**
   * Crear negocio
   * POST /business
   */
  async createBusiness(payload: CreateBusinessPayload): Promise<Business> {
    const { data } = await apiClient.post<ApiResponse<CreateBusinessResponse>>(
      '/business',
      payload
    );
    return data.data.business;
  },

  /**
   * Crear suscripción (simula el pago exitoso)
   * POST /subscriptions
   */
  async createSubscription(
    payload: CreateSubscriptionPayload
  ): Promise<CreateSubscriptionResponse['subscription']> {
    const { data } = await apiClient.post<
      ApiResponse<CreateSubscriptionResponse>
    >('/subscriptions', payload);
    return data.data.subscription;
  },
};