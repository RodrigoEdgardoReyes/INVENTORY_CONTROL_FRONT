import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardApi } from '@/api';
import type { DashboardStats, RecentMovement } from '@/types/dashboard.type';

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref<DashboardStats | null>(null);
  const recentMovements = ref<RecentMovement[]>([]);
  const isLoading = ref(false);

  async function fetchDashboardData() {
    isLoading.value = true;
    try {
      const [statsData, movementsData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentMovements()
      ]);
      stats.value = statsData;
      recentMovements.value = movementsData;
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    stats,
    recentMovements,
    isLoading,
    fetchDashboardData
  };
});