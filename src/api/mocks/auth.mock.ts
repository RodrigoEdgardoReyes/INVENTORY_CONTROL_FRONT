// src/api/mocks/auth.mock.ts
import type {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  MeResponse,
  User,
} from '../../types/auth.types';

// ─────────────────────────────────────────────
// Datos mock basados en backend real
// ─────────────────────────────────────────────
const MOCK_USER: User = {
  id: '98e9fc5c-3fec-4ae9-be51-79a3cd695713',
  email: 'admin@inventario.com',
  name: 'Administrador (MOCK)',
  role: 'OWNER',
  businessId: '11111111-1111-1111-1111-111111111111',
  active: true,
  lastLogin: new Date().toISOString(),
  createdAt: '2026-08-10T15:21:33.857Z',
  updatedAt: new Date().toISOString(),
  permissions: {},
  business: {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Barbería El Corte Perfecto (MOCK)',
    businessType: 'barberia',
    logoUrl: null,
    currency: 'USD',
    timezone: 'America/El_Salvador',
    taxPercentage: '13',
    active: true,
  },
};

const MOCK_TOKEN =
  'mock-jwt-token-' + Math.random().toString(36).substring(2);

// Simula latencia de red
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const authMock = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await delay();

    if (
      credentials.email === 'admin@inventario.com' &&
      credentials.password === 'admin123'
    ) {
      console.log('🎭 [MOCK] Login exitoso');
      return {
        user: MOCK_USER,
        token: MOCK_TOKEN,
        refreshToken: 'mock-refresh-' + Date.now(),
      };
    }

    throw {
      response: {
        status: 401,
        data: {
          success: false,
          message: 'Credenciales inválidas (MOCK)',
        },
      },
    };
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    await delay();

    console.log('🎭 [MOCK] Registro exitoso:', data.email);

    const newUser: User = {
      id: 'mock-' + Date.now(),
      email: data.email,
      name: data.name,
      role: 'OWNER',
      businessId: 'mock-business-' + Date.now(),
      active: true,
      createdAt: new Date().toISOString(),
      // updatedAt: new Date().toISOString(),
      permissions: {},
      business: {
        id: 'mock-business-' + Date.now(),
        name: data.businessName,
        businessType: data.businessType,
        active: true,
        currency: 'USD',
        timezone: 'America/El_Salvador',
        taxPercentage: '13',
      },
    };

    return {
      user: newUser,
      token: MOCK_TOKEN,
      refreshToken: 'mock-refresh-' + Date.now(),
    };
  },

  async getMe(): Promise<MeResponse> {
    await delay(200);
    console.log('🎭 [MOCK] getMe');
    return { user: MOCK_USER };
  },

  async logout(): Promise<void> {
    await delay(150);
    console.log('🎭 [MOCK] Logout');
  },
};