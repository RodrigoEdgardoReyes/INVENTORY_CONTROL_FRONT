// src/api/mocks/service.mock.ts
import type { Service, ServiceFormData, ServiceRecord, ServiceRecordFormData } from '@/types/service.types';

// Simulamos la base de datos en memoria
let mockServices: Service[] = [
  {
    id: 'srv-1',
    businessId: 'demo-business',
    name: 'Corte Clásico (MOCK)',
    description: 'Corte de cabello tradicional',
    price: '10.00',
    durationMinutes: 30,
    commissionRate: 50,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-2',
    businessId: 'demo-business',
    name: 'Corte + Barba (MOCK)',
    description: 'Corte completo y perfilado de barba',
    price: '15.00',
    durationMinutes: 45,
    commissionRate: 50,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

let mockRecords: ServiceRecord[] = [];

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const serviceMock = {
  async getServices(businessId: string): Promise<Service[]> {
    await delay();
    console.log('🎭 [MOCK] getServices');
    return mockServices.filter(s => s.active);
  },

  async createService(payload: ServiceFormData): Promise<Service> {
    await delay();
    console.log('🎭 [MOCK] createService:', payload);
    
    const newService: Service = {
      id: 'srv-' + Date.now(),
      businessId: payload.businessId || 'demo-business',
      name: payload.name,
      description: payload.description,
      price: payload.price.toString(),
      durationMinutes: payload.durationMinutes,
      commissionRate: payload.commissionRate,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockServices.push(newService);
    return newService;
  },

  async updateService(id: string, payload: Partial<ServiceFormData>): Promise<Service> {
    await delay();
    const index = mockServices.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Servicio no encontrado');
    
    mockServices[index] = { ...mockServices[index], ...payload, price: String(payload.price) };
    return mockServices[index];
  },

  async deleteService(id: string): Promise<void> {
    await delay();
    const index = mockServices.findIndex(s => s.id === id);
    if (index !== -1) mockServices[index].active = false;
  },

  async registerService(payload: ServiceRecordFormData): Promise<ServiceRecord> {
    await delay();
    console.log('🎭 [MOCK] registerService:', payload);
    
    const service = mockServices.find(s => s.id === payload.serviceId);
    
    const record: ServiceRecord = {
      id: 'rec-' + Date.now(),
      businessId: payload.businessId,
      serviceId: payload.serviceId,
      serviceName: service?.name || 'Servicio',
      employeeId: payload.employeeId,
      clientName: payload.clientName,
      price: payload.price,
      commissionAmount: payload.price * ((service?.commissionRate || 0) / 100),
      createdAt: new Date().toISOString(),
    };

    mockRecords.push(record);
    return record;
  },

  async getServiceRecords(businessId: string): Promise<ServiceRecord[]> {
    await delay();
    console.log('🎭 [MOCK] getServiceRecords');
    return mockRecords;
  }
};