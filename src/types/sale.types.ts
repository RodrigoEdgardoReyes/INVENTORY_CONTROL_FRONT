import type { Product } from './product.types';

export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: string | number; // Precio al momento de la venta
  purchasePrice: string | number; // Para calcular la ganancia
}


export interface SaleDetailItem {
    id: string;
    saleId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: string | number;
    total: string | number;
    purchasePrice: string | number;
    profit: string | number;
}
export interface Sale {
  id: string;
  businessId: string;
  clientName: string;
  clientNit?: string | null;
  invoiceNumber?: string | null;
  paymentMethod: PaymentMethod;
  subtotal: string | number;
  tax: string | number;
  total: string | number;
  profit?: string | number;
  createdAt: string;
  details?: SaleDetailItem[]; 
}

// Para el Carrito (Frontend)
export interface CartItem {
  product: Product;
  quantity: number;
}

// Para enviar al Backend
export interface SaleFormData {
  businessId: string;
  clientName: string;
  clientNit?: string;
  invoiceNumber?: string;
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  profit: number;
}