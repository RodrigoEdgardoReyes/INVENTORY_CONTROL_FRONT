export interface Service {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  price: string | number; 
  durationMinutes: number;
  commissionPercentage: number; 
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
  commissionPercentage: number;
}

export interface ServiceRecord {
  id: string;
  businessId: string;
  serviceId: string;
  serviceName: string; 
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

export interface BatchRecordItem {
  serviceId: string;
  quantity: number;
}

export interface BatchRecordPayload {
  businessId: string;
  employeeId: string;
  clientName: string;
  items: BatchRecordItem[];
}

// 2. Lo que nos devuelve el backend
export interface BatchReceipt {
  businessId: string;
  businessName: string;
  employeeId: string | null;
  clientName: string;
  itemsCount: number;
  totalQuantity: number;
  total: number;
  totalCommission: number;
  serviceDate: string;
}

export interface BatchRecordResult {
  id: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  employeeId: string | null;
  quantity: number;
  price: string;
  total: string;
  commission: string | null;
  serviceDate: string;
}

export interface BatchRecordResponse {
  records: BatchRecordResult[];
  receipt: BatchReceipt;
}