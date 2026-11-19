import { defineStore } from 'pinia';
import { ref } from 'vue';
// import { serviceApiReal as serviceApi } from '@/api/service.api'; 
import { serviceApi } from '@/api';
import { useAuthStore } from '@/store/authStore';
import type { Service, ServiceFormData, ServiceRecord, ServiceRecordFormData } from '@/types/service.types';

export const useServiceStore = defineStore('services', () => {
  const services = ref<Service[]>([]);
  const serviceRecords = ref<ServiceRecord[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchServices() {
    const authStore = useAuthStore();
    const businessId = authStore.user?.businessId;
    if (!businessId) return;

    isLoading.value = true;
    try {
      const data = await serviceApi.getServices(businessId);
    
    // Solo se guarda los que tengan active: true
    services.value = data.filter((s) => s.active !== false);
      // services.value = await serviceApi.getServices(businessId);
    } catch (e: any) {
      error.value = e.message || 'Error al cargar servicios';
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchServiceRecords() {
    const authStore = useAuthStore();
    const businessId = authStore.user?.businessId;
    if (!businessId) return;

    isLoading.value = true;
    try {
      serviceRecords.value = await serviceApi.getServiceRecords(businessId);
    } catch (e: any) {
      error.value = e.message || 'Error al cargar historial';
    } finally {
      isLoading.value = false;
    }
  }

  async function createService(data: ServiceFormData) {
    const authStore = useAuthStore();
    const businessId = authStore.user?.businessId;
    if (!businessId) throw new Error('No hay negocio activo');

    const payload = { ...data, businessId, price: Number(data.price), commissionPercentage: Number(data.commissionPercentage) };
    const newService = await serviceApi.createService(payload);
    await fetchServices();
    return newService;
  }

  async function deleteService(id: string) {
    await serviceApi.deleteService(id);
    await fetchServices();
  }

  async function registerService(data: ServiceRecordFormData) {
    const record = await serviceApi.registerService(data);
    return record;
  }

  async function updateService(id: string, data: ServiceFormData) {
  try {
    const updated = await serviceApi.updateService(id, data);
    await fetchServices(); // Refrescamos la lista
    return updated;
  } catch (e) {
    console.error('Error actualizando servicio', e);
    throw e;
  }
}

  return {
    services, serviceRecords, isLoading, error,
    fetchServices, fetchServiceRecords, createService, deleteService, registerService, updateService
  };
});