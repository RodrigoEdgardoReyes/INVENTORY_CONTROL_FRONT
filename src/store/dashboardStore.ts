import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '../config/axios';

interface DashboardSummary {
  totalProducts: number;
  lowStockProducts: number;
  monthlyEntries: number;
  monthlyExits: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

interface RecentMovement {
  id: string;
  type: 'ENTRY' | 'EXIT';
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  reason: string;
  date: string;
}

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary>({
    totalProducts: 0,
    lowStockProducts: 0,
    monthlyEntries: 0,
    monthlyExits: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0
  });
  
  const recentMovements = ref<RecentMovement[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSummary() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiClient.get('/dashboard/summary');
      summary.value = response.data;
      
      const movementsResponse = await apiClient.get('/movements/recent');
      recentMovements.value = movementsResponse.data;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar dashboard';
      // Datos de ejemplo para desarrollo
      summary.value = {
        totalProducts: 150,
        lowStockProducts: 12,
        monthlyEntries: 45,
        monthlyExits: 38,
        totalRevenue: 25000,
        totalExpenses: 18000,
        netProfit: 7000
      };
      
      recentMovements.value = [
        {
          id: '1',
          type: 'ENTRY',
          productName: 'Producto A',
          quantity: 50,
          unitPrice: 10,
          total: 500,
          reason: 'Compra',
          date: '2024-01-15'
        },
        {
          id: '2',
          type: 'EXIT',
          productName: 'Producto B',
          quantity: 5,
          unitPrice: 25,
          total: 125,
          reason: 'Venta',
          date: '2024-01-14'
        }
      ];
    } finally {
      loading.value = false;
    }
  }

  return {
    summary,
    recentMovements,
    loading,
    error,
    fetchSummary
  };
});