import type { Business } from './auth.types';

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
  description: string;
  level: 'BASIC' | 'PRO' | 'ENTERPRISE';
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    maxUsers: number;
    maxProducts: number;
    maxBusinesses: number;
  };
  recommended?: boolean;
}

/**
 * Suscripción activa del negocio
 */
export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  level: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  features: string[];
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