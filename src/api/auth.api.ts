import apiClient from '../config/axios';
import type { ApiResponse } from '@/types/common.types';
import type {
  LoginCredentials,
  RegisterData,
  LoginResponse,
  MeResponse,
  User,
} from '../types/auth.types';

// ─────────────────────────────────────────────
// Implementación REAL contra el backend
// ─────────────────────────────────────────────
export const authApiReal = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    );
    return data.data;
  },

  async register(payload: RegisterData): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/register',
      payload
    );
    return data.data;
  },

  async getMe(): Promise<MeResponse> {
    const { data } = await apiClient.get<ApiResponse<MeResponse>>('/auth/me');
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },
};