export interface Product {
  id: string;
  businessId?: string;
  sku: string;
  name: string;
  category: string;
  categoryId?: string;
  description?: string;
  stock: number;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
  imageUrl?: string | null;
  active?: boolean;
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