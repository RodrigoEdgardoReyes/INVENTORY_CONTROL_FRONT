export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  description?: string;
  stock: number;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductForm {
  sku: string;
  name: string;
  category: string;
  description?: string;
  stock: number;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
}

export interface ProductFilters {
  search: string;
  category: string;
  lowStock: boolean;
}