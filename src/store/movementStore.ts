import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { movementService } from '../services/api/movementService';
import type { Movement, EntryForm, ExitForm, MovementFilters } from '../types/movement.types';

export const useMovementStore = defineStore('movements', () => {
  const movements = ref<Movement[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filters = reactive<MovementFilters>({
    startDate: null,
    endDate: null,
    type: '',
    productId: '',
    page: 1,
    limit: 10
  });
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  async function fetchMovements() {
    loading.value = true;
    error.value = null;
    try {
      const response = await movementService.getAll(filters);
      movements.value = response.movements;
      pagination.value = response.pagination;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar movimientos';
    } finally {
      loading.value = false;
    }
  }

  async function registerEntry(entry: EntryForm): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await movementService.createEntry(entry);
      return true;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al registrar entrada';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function registerExit(exit: ExitForm): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      await movementService.createExit(exit);
      return true;
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al registrar salida';
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    movements,
    loading,
    error,
    filters,
    pagination,
    fetchMovements,
    registerEntry,
    registerExit
  };
});