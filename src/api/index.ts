import { authApiReal } from './auth.api';
import { authMock } from './mocks/auth.mock';
import { businessApiReal } from './business.api';
import { businessMock } from './mocks/business.mock';
import { dashboardApiReal } from './dashboard.api';
import { dashboardMock } from './mocks/dashboard.mock';
import { productApiReal } from './product.api';
import { categoryApiReal } from './category.api';
import { productMock } from './mocks/product.mock';
import { categoryMock } from './mocks/category.mock';
import { serviceApiReal } from './service.api';
import { serviceMock } from './mocks/service.mock';
import { saleApiReal } from './sale.api';
// import { saleMock } from './mocks/sale.mock';

// ─────────────────────────────────────────────
// Interruptores por módulo
// ─────────────────────────────────────────────
const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';
const USE_MOCK_BUSINESS = import.meta.env.VITE_USE_MOCK_BUSINESS === 'true';
const USE_MOCK_DASHBOARD = import.meta.env.VITE_USE_MOCK_DASHBOARD === 'true';
const USE_MOCK_PRODUCTS = import.meta.env.VITE_USE_MOCK_PRODUCTS === 'true';
const USE_MOCK_CATEGORIES = import.meta.env.VITE_USE_MOCK_CATEGORIES === 'true';
const USE_MOCK_SERVICES = import.meta.env.VITE_USE_MOCK_SERVICES === 'true';
const USE_MOCK_SALES = import.meta.env.VITE_USE_MOCK_SALES === 'true';

// Log de modo (util para debug)
if(import.meta.env.DEV){
console.log(
  `🔌 API Mode - Auth: ${USE_MOCK_AUTH ? '🎭 MOCK' : '🌐 REAL'} | ` +
  `Business=${USE_MOCK_BUSINESS ? '🎭 MOCK' : '🌐 REAL'} | ` +
  `Dashboard=${USE_MOCK_DASHBOARD ? '🎭 MOCK' : '🌐 REAL'} | ` +
  `Products=${USE_MOCK_PRODUCTS ? '🎭 MOCK' : '🌐 REAL'} | ` +
  `Categories=${USE_MOCK_CATEGORIES ? '🎭 MOCK' : '🌐 REAL'} | ` +
  `Services=${USE_MOCK_SERVICES ? '🎭 MOCK' : '🌐 REAL'} | ` +
  `Sales=${USE_MOCK_SALES ? '🎭 MOCK' : '🌐 REAL'}`
);
console.log(`🌐 API Base: ${import.meta.env.VITE_API_URL}`);
}

// ─────────────────────────────────────────────
// Selector por módulo | APIs activas
// ─────────────────────────────────────────────
export const authApi = USE_MOCK_AUTH ? authMock : authApiReal;
export const businessApi = USE_MOCK_BUSINESS ? businessMock : businessApiReal;
export const dashboardApi = USE_MOCK_DASHBOARD ? dashboardMock : dashboardApiReal;
export const productApi = USE_MOCK_PRODUCTS ? productMock : productApiReal;
export const categoryApi = USE_MOCK_CATEGORIES ? categoryMock : categoryApiReal;
export const serviceApi = USE_MOCK_SERVICES ?serviceMock : serviceApiReal; 
export const saleApi = saleApiReal;

// Exporta el tipo común (ambos tienen la misma interfaz)
export type AuthApi = typeof authApiReal;
export type BusinessApi = typeof businessApiReal;