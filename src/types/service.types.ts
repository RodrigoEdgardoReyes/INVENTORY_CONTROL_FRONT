export interface Service {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  price: string | number; 
  durationMinutes: number;
  commissionRate: number; 
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFormData {
  businessId?: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  commissionRate: number;
}

export interface ServiceRecord {
  id: string;
  businessId: string;
  serviceId: string;
  serviceName: string; // Útil para mostrar en el historial
  employeeId: string;
  employeeName?: string;
  clientName?: string;
  price: number;
  commissionAmount: number;
  createdAt: string;
}

export interface ServiceRecordFormData {
  businessId: string;
  serviceId: string;
  employeeId: string;
  clientName?: string;
  price: number;
}

// Para el carrito del Modo Barbería
export interface TicketItem {
  service: Service;
  quantity: number;
}