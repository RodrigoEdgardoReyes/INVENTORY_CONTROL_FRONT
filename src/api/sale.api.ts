import apiClient from '@/config/axios';
import type { ApiResponse } from '@/types/common.types';
import type { Sale, SaleFormData } from '@/types/sale.types';

export const saleApiReal = {
  async getSales(businessId: string): Promise<Sale[]> {
    const { data } = await apiClient.get<ApiResponse<{ sales: Sale[] }>>(
      `/sales/business/${businessId}`
    );
    return data.data.sales;
  },

  async getSaleById(id: string): Promise<Sale> {
    const { data } = await apiClient.get<ApiResponse<{ sale: Sale }>>(`/sales/${id}`);
    return data.data.sale;
  },

  async createSale(payload: SaleFormData): Promise<Sale> {
    const { data } = await apiClient.post<ApiResponse<Sale>>('/sales', payload);
    return data.data;
  }
};