<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-800">InventoryPro</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                v-for="item in navigation"
                :key="item.name"
                :to="item.href"
                class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                :class="[
                  isCurrentRoute(item.href)
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">{{ authStore.user?.name }}</span>
              <button
                @click="handleLogout"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar y Contenido -->
    <div class="flex">
      <!-- Sidebar -->
      <div class="hidden md:flex md:flex-shrink-0">
        <div class="flex flex-col w-64">
          <div class="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav class="flex-1 px-2 space-y-1">
                <router-link
                  v-for="item in sidebarNavigation"
                  :key="item.name"
                  :to="item.href"
                  class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  :class="[
                    isCurrentRoute(item.href)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  ]"
                >
                  <span class="flex-1">{{ item.name }}</span>
                  <span
                    v-if="item.badge"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    {{ item.badge }}
                  </span>
                </router-link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <main class="flex-1 relative overflow-y-auto focus:outline-none">
          <div class="py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <router-view />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import { useProductsStore } from '../../store/productStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const productsStore = useProductsStore();

const lowStockCount = computed(() => {
  return productsStore.products.filter(p => p.stock <= p.minStock).length;
});

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Productos', href: '/products' },
  { name: 'Movimientos', href: '/kardex' }
];

const sidebarNavigation = [
  { name: 'Panel Principal', href: '/', badge: null },
  { name: 'Productos', href: '/products', badge: null },
  { name: 'Entradas', href: '/entries', badge: null },
  { name: 'Salidas', href: '/exits', badge: null },
  { name: 'Historial (Kardex)', href: '/kardex', badge: null },
  { name: 'Alertas Stock', href: '/alerts', badge: lowStockCount.value > 0 ? lowStockCount.value.toString() : null }
];

function isCurrentRoute(path: string): boolean {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>