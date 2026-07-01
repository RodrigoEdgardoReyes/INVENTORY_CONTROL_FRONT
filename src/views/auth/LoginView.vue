<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Control de Inventario
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Inicia sesión para acceder al sistema
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <AppInput
            v-model="form.email"
            label="Email"
            type="email"
            :error="errors.email"
            placeholder="correo@ejemplo.com"
          />
          <AppInput
            v-model="form.password"
            label="Contraseña"
            type="password"
            :error="errors.password"
            placeholder="Tu contraseña"
          />
        </div>

        <div v-if="authStore.error" class="text-red-600 text-sm text-center">
          {{ authStore.error }}
        </div>

        <AppButton
          type="submit"
          :loading="authStore.loading"
          class="w-full"
          size="lg"
        >
          Iniciar Sesión
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import AppInput from '../../components/common/AppInput.vue';
import AppButton from '../../components/common/AppButton.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

function validate() {
  let valid = true;
  errors.email = '';
  errors.password = '';

  if (!form.email) {
    errors.email = 'Email requerido';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email inválido';
    valid = false;
  }

  if (!form.password) {
    errors.password = 'Contraseña requerida';
    valid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
    valid = false;
  }

  return valid;
}

async function handleLogin() {
  if (!validate()) return;
  
  const success = await authStore.login(form);
  if (success) {
    router.push('/');
  }
}
</script>