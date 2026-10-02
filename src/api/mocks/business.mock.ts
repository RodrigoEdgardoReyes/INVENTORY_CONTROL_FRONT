// src/api/mocks/business.mock.ts
import type {
  Plan,
  CreateBusinessPayload,
} from '@/types/business.types';
import type { Business } from '@/types/auth.types';
import type { CreateSubscriptionPayload } from '../business.api';

// ─────────────────────────────────────────────
// Planes mock basados en tu backend real
// ─────────────────────────────────────────────
const MOCK_PLANS: Record<string, Plan[]> = {
  barberia: [
    {
      id: 'mock-plan-barber-lite',
      name: 'Barbería Lite (MOCK)',
      businessType: 'barberia',
      level: 'LITE',
      price: '15',
      description: 'Ideal para barberías pequeñas de 1-2 sillas',
      features: {},
      maxUsers: 2,
      maxBranches: 1,
      hasProducts: false,
      hasEntries: false,
      hasExits: false,
      hasServices: true,
      hasKardex: false,
      hasFinance: false,
      hasCommissions: false,
      hasApiAccess: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      _count: { subscriptions: 0 },
    },
    {
      id: 'mock-plan-barber-pro',
      name: 'Barbería Pro (MOCK)',
      businessType: 'barberia',
      level: 'PRO',
      price: '30',
      description: 'Barbería con productos y control de stock',
      features: {},
      maxUsers: 5,
      maxBranches: 1,
      hasProducts: true,
      hasEntries: true,
      hasExits: true,
      hasServices: true,
      hasKardex: true,
      hasFinance: false,
      hasCommissions: false,
      hasApiAccess: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      _count: { subscriptions: 1 },
    },
    {
      id: 'mock-plan-barber-master',
      name: 'Barbería Master (MOCK)',
      businessType: 'barberia',
      level: 'MASTER',
      price: '50',
      description: 'Barbería con finanzas y comisiones',
      features: {},
      maxUsers: 15,
      maxBranches: 3,
      hasProducts: true,
      hasEntries: true,
      hasExits: true,
      hasServices: true,
      hasKardex: true,
      hasFinance: true,
      hasCommissions: true,
      hasApiAccess: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      _count: { subscriptions: 0 },
    },
    {
      id: 'mock-plan-barber-empire',
      name: 'Barbería Empire (MOCK)',
      businessType: 'barberia',
      level: 'EMPIRE',
      price: '80',
      description: 'Cadena de barberías sin límites',
      features: {},
      maxUsers: 50,
      maxBranches: 999,
      hasProducts: true,
      hasEntries: true,
      hasExits: true,
      hasServices: true,
      hasKardex: true,
      hasFinance: true,
      hasCommissions: true,
      hasApiAccess: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      _count: { subscriptions: 0 },
    },
  ],
  retail: [
    {
      id: 'mock-plan-retail-lite',
      name: 'Retail Lite (MOCK)',
      businessType: 'retail',
      level: 'LITE',
      price: '20',
      description: 'Tienda pequeña',
      features: {},
      maxUsers: 2,
      maxBranches: 1,
      hasProducts: true,
      hasEntries: true,
      hasExits: true,
      hasServices: false,
      hasKardex: true,
      hasFinance: false,
      hasCommissions: false,
      hasApiAccess: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      _count: { subscriptions: 0 },
    },
  ],
  // Agrega más tipos según necesites
};

// Simular latencia
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const businessMock = {
  async getPlansByType(businessType: string): Promise<Plan[]> {
    await delay();
    console.log('🎭 [MOCK] getPlansByType:', businessType);
    return MOCK_PLANS[businessType] || MOCK_PLANS.barberia;
  },

  async getAllPlans(): Promise<Plan[]> {
    await delay();
    console.log('🎭 [MOCK] getAllPlans');
    return Object.values(MOCK_PLANS).flat();
  },

  async createBusiness(payload: CreateBusinessPayload): Promise<Business> {
    await delay();
    console.log('🎭 [MOCK] createBusiness:', payload);

    return {
      id: 'mock-business-' + Date.now(),
      name: payload.name,
      businessType: payload.businessType,
      currency: payload.currency || 'USD',
      timezone: payload.timezone || 'America/El_Salvador',
      taxPercentage: String(payload.taxPercentage || '13'),
      active: true,
    };
  },

  async createSubscription(payload: CreateSubscriptionPayload) {
    await delay();
    console.log('🎭 [MOCK] createSubscription:', payload);

    return {
      id: 'mock-subscription-' + Date.now(),
      businessId: payload.businessId,
      planId: payload.planId,
      monthlyPrice: payload.monthlyPrice,
      paymentStatus: payload.paymentStatus,
      active: true,
    };
  },
};