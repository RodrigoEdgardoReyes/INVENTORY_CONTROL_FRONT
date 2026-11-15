import type { Category } from '@/types/product.types';

export const categoryMock = {
  async getCategories(type: 'PRODUCT' | 'SERVICE' = 'PRODUCT'): Promise<Category[]> {
    return [];
  },
  async createCategory(payload: Partial<Category>): Promise<Category> {
    throw new Error('Mock no implementado');
  }
};