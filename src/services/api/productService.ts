import apiClient from './client';
import type { Product, ProductForm } from '../../types/product.types';

export const productService = {
  async getAll(filters?: { search?: string; category?: string }): Promise<Product[]> {
    const { data } = await apiClient.get<Product[]>('/products', { params: filters });
    return data;
  },

  async getById(id: string): Promise<Product> {
    const { data } = await apiClient.get<Product>(`/products/${id}`);
    return data;
  },

  async create(product: ProductForm): Promise<Product> {
    const { data } = await apiClient.post<Product>('/products', product);
    return data;
  },

  async update(id: string, product: Partial<ProductForm>): Promise<Product> {
    const { data } = await apiClient.put<Product>(`/products/${id}`, product);
    return data;
  },

  async checkSku(sku: string, excludeId?: string): Promise<boolean> {
    const { data } = await apiClient.get<{ available: boolean }>('/products/check-sku', {
      params: { sku, excludeId }
    });
    return data.available;
  }
};