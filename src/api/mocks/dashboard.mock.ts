import type { DashboardStats, RecentMovement } from '@/types/dashboard.type';

export const dashboardMock = {
  async getStats(): Promise<DashboardStats> {
    await new Promise(r => setTimeout(r, 500));
    return {
      todayRevenue: 450.50,
      todayServices: 12,
      todayProducts: 5,
      todayProfit: 180.20,
      totalProducts: 145,
      lowStockCount: 3
    };
  },
  async getRecentMovements(): Promise<RecentMovement[]> {
    await new Promise(r => setTimeout(r, 600));
    return [
      { id: '1', type: 'SERVICE', description: 'Corte de cabello + Barba', amount: 15, createdAt: new Date().toISOString(), userName: 'Carlos' },
      { id: '2', type: 'SALE', description: 'Shampoo 400ml', amount: 12.50, createdAt: new Date().toISOString(), userName: 'Ana' },
      { id: '3', type: 'SERVICE', description: 'Corte clásico', amount: 10, createdAt: new Date(Date.now() - 3600000).toISOString(), userName: 'Pedro' },
    ];
  }
};