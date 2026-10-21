

<!-- src/views/dashboard/Dashboard.vue -->
<!-- 
<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">📊 Dashboard</h1>
    
    <div class="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
      <p class="text-sm text-green-700">
        ✅ Bienvenido, <strong>{{ authStore.user?.name }}</strong>
      </p>
      <p class="text-sm text-green-700 mt-1">
        🏢 Negocio: <strong>{{ authStore.user?.business?.name || 'No configurado' }}</strong>
      </p>
      <p class="text-sm text-green-700 mt-1">
        👤 Rol: <strong>{{ authStore.user?.role }}</strong>
      </p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">📦 Productos</h3>
        <p class="text-2xl font-bold mt-2">0</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">💰 Ventas</h3>
        <p class="text-2xl font-bold mt-2">0</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-sm font-medium text-gray-500">📈 Ingresos</h3>
        <p class="text-2xl font-bold mt-2">$0</p>
      </div>
    </div>
    
    <div class="mt-6">
      <button 
        @click="logout"
        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Cerrar Sesión
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script> -->


<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboard.store';
import { formatCurrency, formatDate } from '@/utils/formatters'; // Añadimos formatDate de la fase 1
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const router = useRouter();

const businessType = computed(() => authStore.user?.business?.businessType);

// Acciones rápidas dinámicas según el negocio
const quickAction = computed(() => {
  switch (businessType.value) {
    case 'barberia': return { label: 'Nuevo Servicio', icon: '✂️', path: '/services/register' };
    case 'zapateria': return { label: 'Nueva Venta', icon: '💰', path: '/sales/create' };
    case 'ferreteria': return { label: 'Nueva Venta', icon: '💰', path: '/sales/create' };
    default: return { label: 'Nueva Venta', icon: '🛒', path: '/sales/create' };
  }
});

onMounted(() => {
  dashboardStore.fetchDashboardData();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Bienvenida y Acción Rápida -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">¡Hola, {{ authStore.user?.name }}! 👋</h1>
        <h2 class="text-lg font-semibold text-gray-700">Resumen de tu día · martes, 20 de octubre</h2>
        <p class="text-gray-500">Esto es lo que está pasando hoy en {{ authStore.user?.business?.name }}.</p>
      </div>
      <button 
        @click="router.push(quickAction.path)"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
      >
        {{ quickAction.icon }} {{ quickAction.label }}
      </button>
    </div>

    <!-- Estado de Carga -->
    <div v-if="dashboardStore.isLoading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-gray-500">Cargando estadísticas...</p>
    </div>

    <!-- Contenido del Dashboard -->
    <div v-else-if="dashboardStore.stats" class="space-y-6">
      
      <!-- Tarjetas de Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Ingresos Hoy -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Ingresos hoy</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatCurrency(dashboardStore.stats.todayRevenue) }}</p>
            </div>
            <div class="p-3 bg-green-50 text-green-600 rounded-lg">💰</div>
          </div>
        </div>

        <!-- Servicios Hoy (Solo si tiene servicios) -->
        <div v-if="authStore.hasModule('hasServices')" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Servicios hoy</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ dashboardStore.stats.todayServices }}</p>
            </div>
            <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">✂️</div>
          </div>
        </div>

        <!-- Productos Vendidos Hoy -->
        <div v-if="authStore.hasModule('hasProducts')" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Productos vendidos</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ dashboardStore.stats.todayProducts }}</p>
            </div>
            <div class="p-3 bg-purple-50 text-purple-600 rounded-lg">📦</div>
          </div>
        </div>

        <!-- Ganancia Neta -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Ganancia estimada</p>
              <p class="text-2xl font-bold text-indigo-600 mt-1">{{ formatCurrency(dashboardStore.stats.todayProfit) }}</p>
            </div>
            <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">📈</div>
          </div>
        </div>
      </div>

      <!-- Últimos Movimientos -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">Últimos Movimientos</h2>
        </div>
        
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th class="px-6 py-3 font-medium">Tipo</th>
              <th class="px-6 py-3 font-medium">Descripción</th>
              <th class="px-6 py-3 font-medium">Atendido por</th>
              <th class="px-6 py-3 font-medium">Monto</th>
              <th class="px-6 py-3 font-medium">Hora</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="mov in dashboardStore.recentMovements" :key="mov.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': mov.type === 'SERVICE',
                    'bg-green-100 text-green-800': mov.type === 'SALE',
                    'bg-orange-100 text-orange-800': mov.type === 'PURCHASE',
                  }"
                >
                  {{ mov.type === 'SERVICE' ? 'Servicio' : mov.type === 'SALE' ? 'Venta' : 'Compra' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ mov.description }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ mov.userName }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ formatCurrency(mov.amount) }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(mov.createdAt) }}</td>
            </tr>
            <tr v-if="dashboardStore.recentMovements.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">No hay movimientos recientes hoy.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>