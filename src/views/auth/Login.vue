<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';
import type { LoginCredentials } from '@/types/auth.types';

const router = useRouter();
const authStore = useAuthStore();

const form = ref<LoginCredentials>({
  email: '',
  password: '',
});

const errorMessage = ref('');
const isMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

const handleSubmit = async () => {
  errorMessage.value = '';

  try {
    await authStore.login(form.value);

    // // Redirigir según tenga negocio o no
    // if (authStore.hasBusiness) {
    //   router.push('/dashboard');
    // } else {
    //   router.push('/onboarding');
    // }

     // Redirigir según tenga negocio o no
    if (authStore.hasBusiness) {
      router.push(ROUTES.DASHBOARD);
    } else {
      router.push(ROUTES.ONBOARDING_BUSINESS_TYPE);
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