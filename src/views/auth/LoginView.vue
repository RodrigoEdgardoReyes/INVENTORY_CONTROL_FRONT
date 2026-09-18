<!-- src/views/auth/Login.vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center mb-8">🔐 Iniciar Sesión</h2>
      
      <div v-if="isDev" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <p class="text-sm text-yellow-800">
          🔧 Credenciales: <strong>admin@inventario.com</strong> / <strong>admin123</strong>
        </p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="credentials.email"
            type="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            v-model="credentials.password"
            type="password"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'Cargando...' : 'Iniciar Sesión' }}
        </button>
        
        <p v-if="error" class="text-red-600 text-sm text-center">{{ error }}</p>
        <p v-if="loginSuccess" class="text-green-600 text-sm text-center">
          ✅ Login exitoso! Redirigiendo...
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const isDev = import.meta.env.DEV;
const loginSuccess = ref(false);
const loading = ref(false);
const error = ref('');
const credentials = ref({
  email: 'admin@inventario.com',
  password: 'admin123'
});

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  loginSuccess.value = false;
  
  try {
    const success = await authStore.login(credentials.value);
    
    if (success) {
      loginSuccess.value = true;
      console.log('✅ Login exitoso');
      
      setTimeout(() => {
        if (authStore.user?.businessId) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      }, 300);
    } else {
      error.value = authStore.error || 'Credenciales inválidas';
    }
  } catch (err) {
    error.value = 'Error al iniciar sesión';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  console.log('🟢 COMPONENTE LOGIN MONTADO');
  if (authStore.isAuthenticated) {
    if (authStore.user?.businessId) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  }
});
</script> -->





<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import type { LoginCredentials } from '../../types/auth.types';

const router = useRouter();
const authStore = useAuthStore();

const form = ref<LoginCredentials>({
  email: '',
  password: '',
});

const errorMessage = ref('');
const isMock = import.meta.env.VITE_USE_MOCK === 'true';

const handleSubmit = async () => {
  errorMessage.value = '';

  try {
    await authStore.login(form.value);

    // Redirigir según tenga negocio o no
    if (authStore.hasBusiness) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Error al iniciar sesión';
  }
};

const fillDemoCredentials = () => {
  form.value.email = 'admin@inventario.com';
  form.value.password = 'admin123';
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sistema de Control de Inventario Multinegocio
        </p>
        <p
          v-if="isMock"
          class="mt-2 text-center text-xs text-amber-600 bg-amber-50 py-1 rounded"
        >
          🎭 Modo MOCK activo
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Correo electrónico</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Correo electrónico"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="text-sm text-red-600 bg-red-50 p-3 rounded"
        >
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="authStore.isLoading">Cargando...</span>
            <span v-else>Iniciar Sesión</span>
          </button>
        </div>

        <div
          v-if="isMock"
          class="text-center text-sm text-gray-500"
        >
          <button
            type="button"
            @click="fillDemoCredentials"
            class="text-indigo-600 hover:text-indigo-500"
          >
            Rellenar credenciales demo
          </button>
        </div>

        <div class="text-sm text-center">
          <router-link
            to="/register"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ¿No tienes cuenta? Regístrate
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>