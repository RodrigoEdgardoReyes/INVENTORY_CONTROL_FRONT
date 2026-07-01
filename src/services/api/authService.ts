import apiClient from './client';
import type { LoginCredentials, LoginResponse, User } from '../../types/auth.types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/profile');
    return data;
  }
};