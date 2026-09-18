<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import type { RegisterData } from '../../types/auth.types';

const router = useRouter();
const authStore = useAuthStore();

const form = ref<RegisterData>({
  name: '',
  email: '',
  password: '',
  businessType: 'barberia',
  businessName: '',
  planId: 'basic',
});

const confirmPassword = ref('');
const errorMessage = ref('');
const isMock = import.meta.env.VITE_USE_MOCK === 'true';

const businessTypes = [
  { value: 'barberia', label: '💈 Barbería' },
  { value: 'retail', label: '🛍️ Tienda minorista' },
  { value: 'restaurant', label: '🍽️ Restaurante' },
  { value: 'wholesale', label: '📦 Mayorista' },
  { value: 'services', label: '🔧 Servicios' },
];

const handleSubmit = async () => {
  errorMessage.value = '';

  if (form.value.password !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden';
    return;
  }

  if (form.value.password.length < 6) {
    errorMessage.value = 'La contraseña debe tener al menos 6 caracteres';
    return;
  }

  try {
    await authStore.register(form.value);
    router.push('/dashboard');
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Error al registrarse';
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear Cuenta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Comienza a gestionar tu negocio
        </p>
        <p
          v-if="isMock"
          class="mt-2 text-center text-xs text-amber-600 bg-amber-50 py-1 rounded"
        >
          🎭 Modo MOCK activo
        </p>
      </div>

      <form class="mt-8 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Repite tu contraseña"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de negocio</label>
          <select
            v-model="form.businessType"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option v-for="bt in businessTypes" :key="bt.value" :value="bt.value">
              {{ bt.label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre del negocio</label>
          <input
            v-model="form.businessName"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Mi Negocio"
          />
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
            <span v-if="authStore.isLoading">Creando cuenta...</span>
            <span v-else>Crear Cuenta</span>
          </button>
        </div>

        <div class="text-sm text-center">
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>