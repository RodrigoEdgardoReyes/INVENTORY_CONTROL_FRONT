import apiClient from './client';
import type { Movement, EntryForm, ExitForm, MovementFilters } from '../../types/movement.types';

export const movementService = {
  async getAll(filters?: MovementFilters): Promise<{ movements: Movement[]; pagination: any }> {
    const { data } = await apiClient.get('/movements', { params: filters });
    return data;
  },

  async getByProduct(productId: string): Promise<Movement[]> {
    const { data } = await apiClient.get<Movement[]>(`/movements/product/${productId}`);
    return data;
  },

  async createEntry(entry: EntryForm): Promise<Movement> {
    const { data } = await apiClient.post<Movement>('/movements/entry', entry);
    return data;
  },

  async createExit(exit: ExitForm): Promise<Movement> {
    const { data } = await apiClient.post<Movement>('/movements/exit', exit);
    return data;
  }
};