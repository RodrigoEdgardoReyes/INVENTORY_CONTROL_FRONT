<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { NAVIGATION_MENU } from '@/config/navigation';
import { APP_NAME } from '@/config/constants';

const authStore = useAuthStore();

const filteredMenu = computed(() => {
  return NAVIGATION_MENU.filter(item => {
    // Validar módulo del plan
    if (item.module && !authStore.hasModule(item.module)) return false;
    // Validar rol
    if (item.roles && !authStore.hasRole(item.roles as any)) return false;
    return true;
  });
});
</script>

<template>
  <aside class="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
    <div class="h-16 flex items-center px-6 border-b border-gray-800">
      <span class="text-xl font-bold">🏢 {{ APP_NAME }}</span>
    </div>
    
    <nav class="flex-1 py-4">
      <router-link
        v-for="item in filteredMenu"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        active-class="bg-indigo-600 text-white border-r-4 border-indigo-400"
      >
        <span class="text-xl mr-3">{{ item.icon }}</span>
        {{ item.label }}
      </router-link>
    </nav>
  </aside>
</template>