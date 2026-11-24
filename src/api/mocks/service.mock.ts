// src/api/mocks/service.mock.ts
import type { 
  Service, ServiceFormData, ServiceRecord, ServiceRecordFormData, 
  BatchRecordPayload, BatchRecordResponse 
} from '@/types/service.types';

// Simulamos la base de datos en memoria
let mockServices: Service[] = [
  {
    id: 'srv-1', businessId: 'demo-business', name: 'Corte Clásico (MOCK)', description: 'Corte tradicional',
    price: '10.00', durationMinutes: 30, commissionPercentage: 50, active: true, // ✅ CORREGIDO
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-2', businessId: 'demo-business', name: 'Corte + Barba (MOCK)', description: 'Corte y barba',
    price: '15.00', durationMinutes: 45, commissionPercentage: 50, active: true, // ✅ CORREGIDO
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  }
];

let mockRecords: ServiceRecord[] = [];
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const serviceMock = {
  async getServices(businessId: string): Promise<Service[]> {
    await delay();
    return mockServices.filter(s => s.active);
  },

  async getServiceById(id: string): Promise<Service> {
    await delay();
    const service = mockServices.find(s => s.id === id);
    if (!service) throw new Error('Servicio no encontrado');
    return service;
  },

  async createService(payload: ServiceFormData): Promise<Service> {
    await delay();
    const newService: Service = {
      id: 'srv-' + Date.now(), businessId: payload.businessId || 'demo',
      name: payload.name, description: payload.description,
      price: payload.price.toString(), durationMinutes: payload.durationMinutes,
      commissionPercentage: payload.commissionPercentage, active: true, // ✅ CORREGIDO
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    mockServices.push(newService);
    return newService;
  },

  async updateService(id: string, payload: Partial<ServiceFormData>): Promise<Service> {
    await delay();
    const index = mockServices.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Servicio no encontrado');
    mockServices[index] = { ...mockServices[index], ...payload, price: String(payload.price) } as Service;
    return mockServices[index];
  },

  async deleteService(id: string): Promise<void> {
    await delay();
    const index = mockServices.findIndex(s => s.id === id);
    if (index !== -1) mockServices[index].active = false;
  },

  async registerService(payload: ServiceRecordFormData): Promise<ServiceRecord> {
    await delay();
    const service = mockServices.find(s => s.id === payload.serviceId);
    const record: ServiceRecord = {
      id: 'rec-' + Date.now(), businessId: payload.businessId, serviceId: payload.serviceId,
      serviceName: service?.name || 'Servicio', employeeId: payload.employeeId, clientName: payload.clientName,
      price: payload.price, commissionAmount: payload.price * ((service?.commissionPercentage || 0) / 100),
      createdAt: new Date().toISOString(),
    };
    mockRecords.push(record);
    return record;
  },

  //  Simula el endpoint Batch
  async registerBatch(payload: BatchRecordPayload): Promise<BatchRecordResponse> {
    await delay(600);
    console.log('🎭 [MOCK] registerBatch:', payload);
    
    const records: any[] = [];
    let totalAmount = 0;
    let totalCommission = 0;

    for (const item of payload.items) {
      const service = mockServices.find(s => s.id === item.serviceId);
      if (!service) throw new Error(`Servicio ${item.serviceId} no encontrado`);
      
      const price = Number(service.price);
      const comm = price * (service.commissionPercentage / 100);
      
      totalAmount += price * item.quantity;
      totalCommission += comm * item.quantity;

      records.push({
        id: 'rec-' + Date.now() + Math.random(), serviceId: service.id, serviceName: service.name,
        clientName: payload.clientName, employeeId: payload.employeeId, quantity: item.quantity,
        price: service.price, total: String(price * item.quantity), commission: String(comm * item.quantity),
        serviceDate: new Date().toISOString(),
      });
    }

    return {
      records,
      receipt: {
        businessId: payload.businessId, businessName: 'Negocio Mock', employeeId: payload.employeeId,
        clientName: payload.clientName, itemsCount: payload.items.length,
        totalQuantity: payload.items.reduce((sum, i) => sum + i.quantity, 0),
        total: totalAmount, totalCommission, serviceDate: new Date().toISOString(),
      }
    };
  },

  async getServiceRecords(businessId: string): Promise<ServiceRecord[]> {
    await delay();
    return mockRecords;
  }
};