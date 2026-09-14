// src/services/api/dashboardService.ts
import apiClient from './client';
import type { 
  DashboardSummary, 
  ChartData,
  SimpleChartData,
  TimeSeriesData,
  KPIData 
} from '../../types/dashboard.types';

export const dashboardService = {
  // Obtener resumen del dashboard
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return data;
  },

  // Obtener datos para gráficos
  async getChartData(): Promise<ChartData> {
    const { data } = await apiClient.get<ChartData>('/dashboard/chart');
    return data;
  },

  // Obtener datos para gráficos simples (barras/pie)
  async getSimpleChartData(): Promise<SimpleChartData[]> {
    const { data } = await apiClient.get<SimpleChartData[]>('/dashboard/chart/simple');
    return data;
  },

  // Obtener series temporales
  async getTimeSeriesData(range?: string): Promise<TimeSeriesData[]> {
    const { data } = await apiClient.get<TimeSeriesData[]>('/dashboard/timeseries', {
      params: { range }
    });
    return data;
  },

  // Obtener KPIs
  async getKPIs(): Promise<KPIData[]> {
    const { data } = await apiClient.get<KPIData[]>('/dashboard/kpis');
    return data;
  }
};