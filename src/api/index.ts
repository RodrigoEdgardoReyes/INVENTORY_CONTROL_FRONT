import { authApiReal } from './auth.api';
import { authMock } from './mocks/auth.mock';

// ─────────────────────────────────────────────
// Interruptores por módulo
// ─────────────────────────────────────────────
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

console.log(
  `🔌 API Mode - Auth: ${USE_MOCK_AUTH ? '🎭 MOCK' : '🌐 REAL'}`
);
console.log(`🌐 API Base: ${import.meta.env.VITE_API_URL}`);

// ─────────────────────────────────────────────
// Selector por módulo
// ─────────────────────────────────────────────
export const authApi = USE_MOCK_AUTH ? authMock : authApiReal;

// Cuando agregue más módulos, será:
// export const businessApi = USE_MOCK_BUSINESS ? businessMock : businessApiReal;
// export const productApi = USE_MOCK_PRODUCTS ? productMock : productApiReal;

// Exporta el tipo común (ambos tienen la misma interfaz)
export type AuthApi = typeof authApiReal;