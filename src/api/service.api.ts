import apiClient from '@/config/axios';
import type { ApiResponse } from '@/types/common.types';
import type { Service, ServiceFormData, ServiceRecord, ServiceRecordFormData } from '@/types/service.types';

export const serviceApiReal = {
  async getServices(businessId: string): Promise<Service[]> {
    const { data } = await apiClient.get<ApiResponse<{ services: Service[] }>>(`/services/business/${businessId}`);
    return data.data.services;
  },

  async createService(payload: ServiceFormData): Promise<Service> {
    const { data } = await apiClient.post<ApiResponse<Service>>('/services', payload);
    return data.data;
  },

  async updateService(id: string, payload: Partial<ServiceFormData>): Promise<Service> {
    const { data } = await apiClient.put<ApiResponse<Service>>(`/services/${id}`, payload);
    return data.data;
  },

  async getServiceById(id: string): Promise<Service> {
    const { data } = await apiClient.get<ApiResponse<{ service: Service }>>(`/services/${id}`);
    return data.data.service;
  },

  async deleteService(id: string): Promise<void> {
    await apiClient.delete(`/services/${id}`);
  },

  async registerService(payload: ServiceRecordFormData): Promise<ServiceRecord> {
    const { data } = await apiClient.post<ApiResponse<ServiceRecord>>('/service-records', payload);
    return data.data;
  },

  async getServiceRecords(businessId: string): Promise<ServiceRecord[]> {
    const { data } = await apiClient.get<ApiResponse<{ records: ServiceRecord[] }>>(`/service-records/business/${businessId}`);
    return data.data.records;
  }
};