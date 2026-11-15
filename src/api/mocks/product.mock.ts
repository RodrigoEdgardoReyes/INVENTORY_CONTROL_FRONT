// src/api/mocks/product.mock.ts
import type { Product, ProductFormData, ProductFilters, ProductListResponse } from '@/types/product.types';

export const productMock = {
  // ✅ 1. Cambiamos la firma para que coincida con la Real
  async getProducts(params: any): Promise<ProductListResponse> {
    return {
      products: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    };
  },
  
  async getProductById(id: string): Promise<Product> {
    throw new Error('Mock no implementado');
  },
  
  async createProduct(payload: ProductFormData & { businessId: string }): Promise<Product> {
    throw new Error('Mock no implementado');
  },
  
  async updateProduct(id: string, payload: Partial<ProductFormData>): Promise<Product> {
    throw new Error('Mock no implementado');
  },
  
  async deleteProduct(id: string): Promise<void> {
    throw new Error('Mock no implementado');
  }
};