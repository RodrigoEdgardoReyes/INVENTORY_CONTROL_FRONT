<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/config/constants';

const authStore = useAuthStore();
const router = useRouter();
const showMenu = ref(false);

function handleLogout() {
  authStore.logout();
  router.push(ROUTES.LOGIN);
}
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
    <div class="text-lg font-semibold text-gray-800">
      {{ authStore.user?.business?.name || 'Mi Negocio' }}
    </div>

    <div class="flex items-center space-x-4">
      <button class="text-gray-500 hover:text-gray-700">
        🔔 <!-- Notificaciones -->
      </button>
      
      <!-- Menú de Usuario -->
      <div class="relative">
        <button 
          @click="showMenu = !showMenu"
          class="flex items-center space-x-2 focus:outline-none"
        >
          <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            {{ authStore.user?.name.charAt(0) }}
          </div>
          <span class="text-sm font-medium text-gray-700 hidden md:block">
            {{ authStore.user?.name }}
          </span>
        </button>

        <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
          <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</router-link>
          <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  </header>
</template>