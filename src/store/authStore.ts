import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '../config/axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: LoginCredentials): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
    //   // Simulación de login (reemplazar con llamada real a la API)
    //   const response = await apiClient.post('/auth/login', credentials);
    //   const { user: userData, token: tokenData } = response.data;

    // CREDENCIALES FIJAS PARA DEMO
    if (credentials.email === 'admin@inventario.com' && credentials.password === 'admin123') {
      const userData = {
        id: '1',
        email: 'admin@inventario.com',
        name: 'Administrador',
        role: 'ADMIN'
      };
      const tokenData = 'fake-jwt-token-demo-' + Date.now();

      
      user.value = userData;
      token.value = tokenData;
      
      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return true;
    } else {
      error.value = 'Credenciales inválidas';
      return false;
    }
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al iniciar sesión';
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  async function checkAuth(): Promise<boolean> {
    if (!token.value) return false;
    
    try {
      const response = await apiClient.get('/auth/profile');
      user.value = response.data;
      return true;
    } catch {
      logout();
      return false;
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };
});