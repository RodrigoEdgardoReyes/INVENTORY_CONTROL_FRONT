import apiClient from './client';
import type { DashboardSummary, ChartData } from '../../types/dashboard.types';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return data;
  },

  async getChartData(): Promise<ChartData[]> {
    const { data } = await apiClient.get<ChartData[]>('/dashboard/chart');
    return data;
  }
};