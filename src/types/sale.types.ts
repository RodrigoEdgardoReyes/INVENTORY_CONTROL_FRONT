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

export interface Sale {
  id: string;
  businessId: string;
  clientName: string;
  clientNit?: string;
  invoiceNumber?: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  total: number;
  profit: number;
  createdAt: string;
  items?: SaleItem[]; // verificar, si el backend lo incluye
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