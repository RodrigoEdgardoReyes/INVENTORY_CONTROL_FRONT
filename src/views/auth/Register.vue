<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { ROUTES, VALIDATION } from '@/config/constants';
import type { RegisterData } from '@/types/auth.types';
import { emailSchema } from '@/utils/validators';

const router = useRouter();
const authStore = useAuthStore();

// ─────────────────────────────────────────
// FORM STATE
// ─────────────────────────────────────────
const form = ref<RegisterData>({
  name: '',
  email: '',
  password: '',
});

const confirmPassword = ref('');
const errorMessage = ref('');
const showPassword = ref(false);

const isMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// ─────────────────────────────────────────
// VALIDACIONES EN TIEMPO REAL
// ─────────────────────────────────────────
const nameError = computed(() => {
  if (!form.value.name) return '';
  if (form.value.name.trim().length < VALIDATION.NAME_MIN_LENGTH) {
    return `El nombre debe tener al menos ${VALIDATION.NAME_MIN_LENGTH} caracteres`;
  }
  return '';
});

const emailError = computed(() => {
  if(!form.value.email) return '';

  const result = emailSchema.safeParse(form.value.email);
  if (!result.success) {
    return result.error.issues[0].message; 
  }
  return '';
})

// const emailError = computed(() => {
//   if (!form.value.email) return '';
//   // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   if (!emailRegex.test(form.value.email)) {
//     return 'Ingresa un correo electrónico válido';
//   }
//   return '';
// });

const passwordError = computed(() => {
  if (!form.value.password) return '';
  if (form.value.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`;
  }
  return '';
});

const confirmPasswordError = computed(() => {
  if (!confirmPassword.value) return '';
  if (confirmPassword.value !== form.value.password) {
    return 'Las contraseñas no coinciden';
  }
  return '';
});

const isFormValid = computed(() => {
  return (
    form.value.name.trim().length >= VALIDATION.NAME_MIN_LENGTH &&
    form.value.email.length > 0 &&
    !emailError.value &&
    form.value.password.length >= VALIDATION.PASSWORD_MIN_LENGTH &&
    confirmPassword.value === form.value.password
  );
});

// ─────────────────────────────────────────
// SUBMIT
// ─────────────────────────────────────────
const handleSubmit = async () => {
  errorMessage.value = '';

  // Validaciones finales
  if (!isFormValid.value) {
    errorMessage.value = 'Por favor, corrige los errores del formulario';
    return;
  }

  try {
     // 2. Crear el objeto normalizado
    const normalizedData = {
      name: form.value.name.trim(),
      email: form.value.email.trim().toLowerCase(), // Limpia espacios y minúsculas
      password: form.value.password,
    };

    // 3. Enviar al backend
    await authStore.register(normalizedData);
    // await authStore.register(form.value);

    // El guard detectará que no hay businessId
    // y redirigirá a /onboarding/business-type automáticamente
    router.push(ROUTES.ONBOARDING_BUSINESS_TYPE);
  } catch (error: any) {
    errorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Error al crear la cuenta';
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- HEADER -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crear Cuenta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Comienza a gestionar tu negocio en minutos
        </p>
        <p
          v-if="isMock"
          class="mt-2 text-center text-xs text-amber-600 bg-amber-50 py-1 rounded"
        >
          🎭 Modo MOCK activo
        </p>
      </div>

      <!-- FORM -->
      <form class="mt-8 space-y-5" @submit.prevent="handleSubmit">
        <!-- NOMBRE -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            autocomplete="name"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': nameError }"
            placeholder="Juan Pérez"
          />
          <p v-if="nameError" class="mt-1 text-xs text-red-600">
            {{ nameError }}
          </p>
        </div>

        <!-- EMAIL -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': emailError }"
            placeholder="tu@email.com"
          />
          <p v-if="emailError" class="mt-1 text-xs text-red-600">
            {{ emailError }}
          </p>
        </div>

        <!-- PASSWORD -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div class="relative mt-1">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              class="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :class="{ 'border-red-500': passwordError }"
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <span class="text-sm">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
          </div>
          <p v-if="passwordError" class="mt-1 text-xs text-red-600">
            {{ passwordError }}
          </p>
        </div>

        <!-- CONFIRM PASSWORD -->
        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700"
          >
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :class="{ 'border-red-500': confirmPasswordError }"
            placeholder="Repite tu contraseña"
          />
          <p v-if="confirmPasswordError" class="mt-1 text-xs text-red-600">
            {{ confirmPasswordError }}
          </p>
        </div>

        <!-- ERROR GLOBAL -->
        <div
          v-if="errorMessage"
          class="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200"
        >
          {{ errorMessage }}
        </div>

        <!-- SUBMIT -->
        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.isLoading">Creando cuenta...</span>
            <span v-else>Crear Cuenta</span>
          </button>
        </div>

        <!-- LINK LOGIN -->
        <div class="text-sm text-center">
          <router-link
            :to="ROUTES.LOGIN"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>