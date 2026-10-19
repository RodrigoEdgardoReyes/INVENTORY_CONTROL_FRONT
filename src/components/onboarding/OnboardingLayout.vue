<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { APP_NAME, ROUTES } from '@/config/constants';

interface Props {
  currentStep: number;
  totalSteps: number;
}

defineProps<Props>();

const router = useRouter();
const authStore = useAuthStore();
const onboardingStore = useOnboardingStore();

function handleLogout() {
  authStore.logout();
  onboardingStore.reset();
  router.push(ROUTES.LOGIN);
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- HEADER -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">🏢</span>
            <span class="text-lg font-bold text-gray-900">{{ APP_NAME }}</span>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600 hidden sm:block">
              {{ authStore.user?.name }}
            </span>
            <button
              @click="handleLogout"
              class="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- CONTENT -->
    <main class="flex-1 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <!-- SLOT para el progreso (opcional) -->
        <slot name="progress"></slot>

        <!-- SLOT principal -->
        <div class="mt-8">
          <slot></slot>
        </div>
      </div>
    </main>

    <!-- FOOTER (opcional) -->
    <footer class="bg-white border-t border-gray-200 py-4">
      <div class="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500">
        Paso {{ currentStep }} de {{ totalSteps }} · Configuración de tu negocio
      </div>
    </footer>
  </div>
</template>