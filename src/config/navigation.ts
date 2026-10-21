import type { PlanFeatures } from '@/store/authStore';
import { ROUTES } from './constants';

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  module?: keyof PlanFeatures; // Si requiere un módulo específico del plan
  roles?: string[]; // Si requiere un rol específico
}

export const NAVIGATION_MENU: NavItem[] = [
  { label: 'Dashboard', icon: '📊', path: ROUTES.DASHBOARD },
  { label: 'Productos', icon: '📦', path: '/products', module: 'hasProducts' },
  { label: 'Servicios', icon: '✂️', path: '/services', module: 'hasServices' },
  { label: 'Ventas', icon: '💰', path: '/sales', module: 'hasExits' },
  { label: 'Compras', icon: '🛒', path: '/purchases', module: 'hasEntries' },
  { label: 'Finanzas', icon: '📈', path: '/reports', module: 'hasFinance', roles: ['OWNER', 'MANAGER'] },
  { label: 'Configuración', icon: '⚙️', path: ROUTES.SETTINGS, roles: ['OWNER'] },
];