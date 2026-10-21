import apiClient from '@/config/axios';
import type { ApiResponse } from '@/types/common.types';
import type { DashboardStats, RecentMovement } from '@/types/dashboard.type';

export const dashboardApiReal = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data.data;
  },

  async getRecentMovements(): Promise<RecentMovement[]> {
    const { data } = await apiClient.get<ApiResponse<RecentMovement[]>>('/dashboard/recent-movements');
    return data.data;
  }
};