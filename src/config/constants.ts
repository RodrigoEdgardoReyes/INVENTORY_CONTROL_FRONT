import type { UserRole } from '@/types/auth.types';
import type { BusinessTypeValue } from '@/types/business.types';

// ─────────────────────────────────────────────
// INFORMACIÓN DE LA APP
// ─────────────────────────────────────────────
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Inventory Pro';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ─────────────────────────────────────────────
// ROLES DE USUARIO
// ─────────────────────────────────────────────
export const USER_ROLES: Record<UserRole, { label: string; description: string }> = {
  OWNER: {
    label: 'Propietario',
    description: 'Acceso completo al sistema y configuración',
  },
  MANAGER: {
    label: 'Gerente',
    description: 'Gestión de productos, ventas y reportes',
  },
  EMPLOYEE: {
    label: 'Empleado',
    description: 'Registro de ventas y consultas básicas',
  },
  VIEWER: {
    label: 'Visualizador',
    description: 'Solo lectura de reportes y datos',
  },
};

export const ROLE_HIERARCHY: UserRole[] = ['OWNER', 'MANAGER', 'EMPLOYEE', 'VIEWER'];

// ─────────────────────────────────────────────
// TIPOS DE NEGOCIO
// ─────────────────────────────────────────────
export interface BusinessTypeOption {
  value: BusinessTypeValue;
  label: string;
  icon: string;
  description: string;
  available: boolean;
}

export const BUSINESS_TYPES: BusinessTypeOption[] = [
  {
    value: 'inventario_general',
    label: 'Inventario General',
    icon: '📊',
    description: 'Control financiero básico para cualquier negocio',
    available: true,
  },
  {
    value: 'barberia',
    label: 'Barbería / Salón de Belleza',
    icon: '💈',
    description: 'Servicios, citas y productos de belleza',
    available: true,
  },
  {
    value: 'ferreteria',
    label: 'Ferretería / Construcción',
    icon: '🔩',
    description: 'Productos por unidad, peso y medida',
    available: true,
  },
  {
    value: 'zapateria',
    label: 'Zapatería / Calzado',
    icon: '👞',
    description: 'Tallas, colores y modelos',
    available: true,
  },
  {
    value: 'retail',
    label: 'Tienda / Retail General',
    icon: '🏪',
    description: 'Venta al por menor y al por mayor',
    available: true,
  },
  {
    value: 'otro',
    label: 'Otro',
    icon: '➕',
    description: 'Próximamente: Veterinaria, Farmacia, etc.',
    available: false,
  },
];

// ─────────────────────────────────────────────
// MONEDAS
// ─────────────────────────────────────────────
export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'Dólar estadounidense' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'MXN', symbol: '$', name: 'Peso mexicano' },
  { code: 'GTQ', symbol: 'Q', name: 'Quetzal guatemalteco' },
  { code: 'HNL', symbol: 'L', name: 'Lempira hondureño' },
  { code: 'NIO', symbol: 'C$', name: 'Córdoba nicaragüense' },
  { code: 'CRC', symbol: '₡', name: 'Colón costarricense' },
  { code: 'PAB', symbol: 'B/.', name: 'Balboa panameño' },
  { code: 'COP', symbol: '$', name: 'Peso colombiano' },
  { code: 'PEN', symbol: 'S/', name: 'Sol peruano' },
];

// ─────────────────────────────────────────────
// ZONAS HORARIAS (las más comunes en LATAM)
// ─────────────────────────────────────────────
export const TIMEZONES = [
  { value: 'America/El_Salvador', label: 'El Salvador (GMT-6)' },
  { value: 'America/Guatemala', label: 'Guatemala (GMT-6)' },
  { value: 'America/Tegucigalpa', label: 'Honduras (GMT-6)' },
  { value: 'America/Managua', label: 'Nicaragua (GMT-6)' },
  { value: 'America/Costa_Rica', label: 'Costa Rica (GMT-6)' },
  { value: 'America/Panama', label: 'Panamá (GMT-5)' },
  { value: 'America/Mexico_City', label: 'México (GMT-6)' },
  { value: 'America/Bogota', label: 'Colombia (GMT-5)' },
  { value: 'America/Lima', label: 'Perú (GMT-5)' },
  { value: 'America/Santiago', label: 'Chile (GMT-4)' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (GMT-3)' },
];

// ─────────────────────────────────────────────
// IMPUESTOS (por defecto por país)
// ─────────────────────────────────────────────
export const DEFAULT_TAX_PERCENTAGES: Record<string, number> = {
  SV: 13, // IVA El Salvador
  GT: 12, // IVA Guatemala
  HN: 15, // ISV Honduras
  NI: 15, // IVA Nicaragua
  CR: 13, // IVA Costa Rica
  PA: 7,  // ITBMS Panamá
  MX: 16, // IVA México
  CO: 19, // IVA Colombia
  PE: 18, // IGV Perú
};

// ─────────────────────────────────────────────
// ESTADOS GENÉRICOS
// ─────────────────────────────────────────────
export const STATUS_COLORS = {
  active: 'green',
  inactive: 'gray',
  pending: 'yellow',
  cancelled: 'red',
  completed: 'blue',
  error: 'red',
} as const;

// ─────────────────────────────────────────────
// LÍMITES Y CONFIGURACIÓN
// ─────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
} as const;

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
} as const;

// ─────────────────────────────────────────────
// RUTAS DE LA APP
// ─────────────────────────────────────────────
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  ONBOARDING: '/onboarding',
  PLANS: '/plans',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  SERVICES: '/services',
  SALES: '/sales',
  PURCHASES: '/purchases',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

// ─────────────────────────────────────────────
// CLAVES DE LOCALSTORAGE
// ─────────────────────────────────────────────
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;