// import { defineStore } from 'pinia';
// import { ref, computed } from 'vue';
// import type { User, LoginCredentials } from '../types/auth.types';

// export const useAuthStore = defineStore('auth', () => {
//   const user = ref<User | null>(null);
//   const token = ref<string | null>(localStorage.getItem('token'));
//   const loading = ref(false);
//   const error = ref<string | null>(null);

//   const isAuthenticated = computed(() => !!token.value && !!user.value);

//   // USUARIO DE PRUEBA COMPLETO
//   const DEMO_USER: User = {
//     id: '1',
//     name: 'Administrador Demo',
//     email: 'admin@inventario.com',
//     role: 'OWNER',
//     active: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     // 🔑 CLAVE: Agregar businessId y business para pruebas
//     businessId: 'demo-business-123',
//     business: {
//       id: 'demo-business-123',
//       name: 'Mi Negocio Demo',
//       businessType: 'RETAIL',
//     }
//   };

//   async function login(credentials: LoginCredentials): Promise<boolean> {
//     loading.value = true;
//     error.value = null;
    
//     try {
//       // Simular delay de red
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       // Validar credenciales de prueba
//       if (credentials.email === 'admin@inventario.com' && credentials.password === 'admin123') {
//         // Usar el usuario completo con businessId
//         user.value = DEMO_USER;
//         token.value = 'fake-jwt-token-' + Date.now();
        
//         localStorage.setItem('token', token.value);
//         localStorage.setItem('user', JSON.stringify(DEMO_USER));
        
//         console.log('✅ Login exitoso - Usuario con negocio:', DEMO_USER);
//         return true;
//       } else {
//         error.value = 'Credenciales inválidas. Usa: admin@inventario.com / admin123';
//         return false;
//       }
//     } catch (e: any) {
//       error.value = 'Error al iniciar sesión';
//       return false;
//     } finally {
//       loading.value = false;
//     }
//   }

//   function logout() {
//     user.value = null;
//     token.value = null;
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }

//   function restoreSession(): void {
//     const storedUser = localStorage.getItem('user');
//     const storedToken = localStorage.getItem('token');
    
//     if (storedUser && storedToken) {
//       try {
//         user.value = JSON.parse(storedUser);
//         token.value = storedToken;
//         console.log('♻️ Sesión restaurada:', user.value?.email);
//       } catch (error) {
//         logout();
//       }
//     }
//   }

//   // hasModule para pruebas
//   const hasModule = (moduleKey: string): boolean => {
//     // En modo demo, todos los módulos están disponibles
//     const modules = ['has_products', 'has_services', 'has_exits', 'has_entries', 'has_finance'];
//     return modules.includes(moduleKey);
//   };

//   restoreSession();

//   return {
//     user,
//     token,
//     loading,
//     error,
//     isAuthenticated,
//     hasModule,
//     login,
//     logout,
//     restoreSession,
//   };
// });



// src/store/auth.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../api';
import type {
  User,
  LoginCredentials,
  RegisterData,
  LoginResponse,
  MeResponse,
  UserRole,
} from '../types/auth.types';

export const useAuthStore = defineStore('auth', () => {
  // ─────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const refreshToken = ref<string | null>(
    localStorage.getItem('refreshToken')
  );
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const features = ref<string[]>([]);

  // ─────────────────────────────────────────
  // GETTERS
  // ─────────────────────────────────────────
  const isAuthenticated = computed(
    () => !!token.value && !!user.value
  );
  const isOwner = computed(() => user.value?.role === 'OWNER');
  const isManager = computed(() => user.value?.role === 'MANAGER');
  const isEmployee = computed(() => user.value?.role === 'EMPLOYEE');
  const isViewer = computed(() => user.value?.role === 'VIEWER');

  const userRole = computed<UserRole | undefined>(() => user.value?.role);
  const businessId = computed(() => user.value?.businessId);
  const hasBusiness = computed(() => !!user.value?.businessId);

  const hasModule = (moduleKey: string): boolean =>
    features.value.includes(moduleKey);

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    const role = user.value?.role;
    if (!role) return false;
    return Array.isArray(roles) ? roles.includes(role) : role === roles;
  };

  // ─────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────
  function setAuthData(data: LoginResponse) {
    user.value = data.user;
    token.value = data.token;
    refreshToken.value = data.refreshToken || null;

    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  }

  async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authApi.login(credentials);
      setAuthData(response);
      return response;
    } catch (e: any) {
      error.value =
        e.response?.data?.message ||
        e.response?.data?.error ||
        'Error al iniciar sesión';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(data: RegisterData): Promise<LoginResponse> {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authApi.register(data);
      setAuthData(response);
      return response;
    } catch (e: any) {
      error.value =
        e.response?.data?.message ||
        e.response?.data?.error ||
        'Error al registrarse';
      throw e;
    } finally {
      isLoading.value = false;
    }
  }

  async function getProfile(): Promise<MeResponse | null> {
    if (!token.value) return null;

    try {
      const response = await authApi.getMe();
      user.value = response.user;
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (e) {
      logout();
      throw e;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    features.value = [];
    error.value = null;

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  /** Restaura sesión desde localStorage al arrancar la app */
  function restoreSession() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser);
        token.value = storedToken;
        refreshToken.value = localStorage.getItem('refreshToken');
        console.log('♻️ Sesión restaurada:', user.value?.email);
      } catch {
        logout();
      }
    }
  }

  // Inicialización automática
  restoreSession();

  // ─────────────────────────────────────────
  // EXPORTS
  // ─────────────────────────────────────────
  return {
    // state
    user,
    token,
    refreshToken,
    isLoading,
    error,
    features,
    // getters
    isAuthenticated,
    isOwner,
    isManager,
    isEmployee,
    isViewer,
    userRole,
    businessId,
    hasBusiness,
    hasModule,
    hasRole,
    // actions
    login,
    register,
    getProfile,
    logout,
    restoreSession,
    setAuthData,
  };
});