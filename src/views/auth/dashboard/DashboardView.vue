<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Panel de Control</h1>
    
    <!-- Resumen General -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AppCard :loading="dashboardStore.loading">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600">
            {{ dashboardStore.summary.totalProducts }}
          </div>
          <div class="text-sm text-gray-600 mt-1">Total Productos</div>
        </div>
      </AppCard>

      <AppCard :loading="dashboardStore.loading">
        <div class="text-center">
          <div class="text-3xl font-bold text-red-600">
            {{ dashboardStore.summary.lowStockProducts }}
          </div>
          <div class="text-sm text-gray-600 mt-1">Stock Bajo</div>
        </div>
      </AppCard>

      <AppCard :loading="dashboardStore.loading">
        <div class="text-center">
          <div class="text-3xl font-bold text-green-600">
            {{ dashboardStore.summary.monthlyEntries }}
          </div>
          <div class="text-sm text-gray-600 mt-1">Entradas del Mes</div>
        </div>
      </AppCard>

      <AppCard :loading="dashboardStore.loading">
        <div class="text-center">
          <div class="text-3xl font-bold text-orange-600">
            {{ dashboardStore.summary.monthlyExits }}
          </div>
          <div class="text-sm text-gray-600 mt-1">Salidas del Mes</div>
        </div>
      </AppCard>
    </div>

    <!-- Resumen Financiero -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AppCard title="Ingresos Totales" :loading="dashboardStore.loading">
        <div class="text-2xl font-bold text-green-600">
          ${{ formatCurrency(dashboardStore.summary.totalRevenue) }}
        </div>
      </AppCard>

      <AppCard title="Gastos Totales" :loading="dashboardStore.loading">
        <div class="text-2xl font-bold text-red-600">
          ${{ formatCurrency(dashboardStore.summary.totalExpenses) }}
        </div>
      </AppCard>

      <AppCard title="Ganancia Neta" :loading="dashboardStore.loading">
        <div :class="[
          'text-2xl font-bold',
          dashboardStore.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
        ]">
          ${{ formatCurrency(dashboardStore.summary.netProfit) }}
        </div>
      </AppCard>
    </div>

    <!-- Últimos Movimientos -->
    <AppCard title="Últimos Movimientos" :loading="dashboardStore.loading">
      <AppTable
        :columns="movementColumns"
        :data="dashboardStore.recentMovements"
      >
        <template #cell-type="{ row }">
          <AppBadge :variant="row.type === 'ENTRY' ? 'success' : 'danger'">
            {{ row.type === 'ENTRY' ? 'ENTRADA' : 'SALIDA' }}
          </AppBadge>
        </template>
        <template #cell-total="{ row }">
          <span :class="row.type === 'ENTRY' ? 'text-green-600' : 'text-red-600'">
            ${{ row.total?.toFixed(2) }}
          </span>
        </template>
      </AppTable>
      
      <div class="mt-4 text-center">
        <router-link
          to="/kardex"
          class="text-blue-600 hover:text-blue-800 text-sm"
        >
          Ver todos los movimientos →
        </router-link>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDashboardStore } from '../../../store/dashboardStore';
import AppCard from '../../../components/common/AppCard.vue';
import AppTable from '../../../components/common/AppTable.vue';
import AppBadge from '../../../components/common/AppBadge.vue';

const dashboardStore = useDashboardStore();

const movementColumns = [
  { key: 'date', label: 'Fecha' },
  { key: 'type', label: 'Tipo' },
  { key: 'productName', label: 'Producto' },
  { key: 'quantity', label: 'Cantidad' },
  { key: 'unitPrice', label: 'Precio Unit.' },
  { key: 'total', label: 'Total' },
  { key: 'reason', label: 'Motivo' }
];

function formatCurrency(value: number): string {
  return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

onMounted(() => {
  dashboardStore.fetchSummary();
});
</script>