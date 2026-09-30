import { authApiReal } from './auth.api';
import { authMock } from './mocks/auth.mock';
import { businessApiReal } from './business.api';
import { businessMock } from './mocks/business.mock';

// ─────────────────────────────────────────────
// Interruptores por módulo
// ─────────────────────────────────────────────
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
const USE_MOCK_BUSINESS = import.meta.env.VITE_MOCK_BUSINESS === 'true';

// Log de modo (util para debug)
if(import.meta.env.DEV){
console.log(
  `🔌 API Mode - Auth: ${USE_MOCK_AUTH ? '🎭 MOCK' : '🌐 REAL'} | ` +
  `Business=${USE_MOCK_BUSINESS ? '🎭 MOCK' : '🌐 REAL'}`
);
console.log(`🌐 API Base: ${import.meta.env.VITE_API_URL}`);
}

// ─────────────────────────────────────────────
// Selector por módulo | APIs activas
// ─────────────────────────────────────────────
export const authApi = USE_MOCK_AUTH ? authMock : authApiReal;
export const businessApi = USE_MOCK_BUSINESS ? businessMock : businessApiReal;

// Cuando agregue más módulos, será:
// export const businessApi = USE_MOCK_BUSINESS ? businessMock : businessApiReal;
// export const productApi = USE_MOCK_PRODUCTS ? productMock : productApiReal;

// Exporta el tipo común (ambos tienen la misma interfaz)
export type AuthApi = typeof authApiReal;
export type BusinessApi = typeof businessApiReal;