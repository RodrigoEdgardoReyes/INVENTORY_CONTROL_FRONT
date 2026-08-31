// src/store/authStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, LoginCredentials, AuthResponse } from '../types/auth.types';
import apiClient from '../config/axios';

export const useAuthStore = defineStore('auth', () => {
  // Estado - Usando los tipos correctos de auth.types.ts
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters computados
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  
  const isOwner = computed(() => user.value?.role === 'OWNER');
  const isManager = computed(() => user.value?.role === 'MANAGER' || user.value?.role === 'OWNER');
  const isEmployee = computed(() => ['OWNER', 'MANAGER', 'EMPLOYEE'].includes(user.value?.role || ''));

  // Método para verificar si tiene un módulo específico (para guards)
  const hasModule = (moduleKey: string): boolean => {
    // TODO: Conectar con la suscripción real del backend
    // Por ahora, implementación básica basada en roles
    const moduleAccess: Record<string, string[]> = {
      'has_products': ['OWNER', 'MANAGER'],
      'has_services': ['OWNER', 'MANAGER', 'EMPLOYEE'],
      'has_exits': ['OWNER', 'MANAGER', 'EMPLOYEE'],
      'has_entries': ['OWNER', 'MANAGER'],
      'has_finance': ['OWNER', 'MANAGER', 'VIEWER'],
    };

    const userRole = user.value?.role || '';
    return moduleAccess[moduleKey]?.includes(userRole) || false;
  };

  // Login real con API
  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      const { user: userData, token: tokenData } = response.data;
      
      user.value = userData;
      token.value = tokenData;
      
      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Logout
  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // No redirigir aquí, mejor dejar que el router lo maneje
    // window.location.href = '/login';
  }

  // Verificar autenticación
  async function checkAuth(): Promise<boolean> {
    if (!token.value) {
      logout();
      return false;
    }
    
    try {
      const response = await apiClient.get<{ user: User }>('/auth/me');
      user.value = response.data.user || response.data;
      return true;
    } catch (error) {
      logout();
      return false;
    }
  }

  // Restaurar sesión desde localStorage
  function restoreSession(): void {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser);
        token.value = storedToken;
      } catch (error) {
        logout();
      }
    }
  }

  // Inicializar restaurando sesión
  restoreSession();

  return {
    // Estado
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isOwner,
    isManager,
    isEmployee,
    
    // Métodos
    login,
    logout,
    checkAuth,
    hasModule,
    restoreSession,
  };
});