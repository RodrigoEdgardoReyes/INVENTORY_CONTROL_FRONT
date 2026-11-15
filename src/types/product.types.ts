export interface Category {
  id: string;
  name: string;
  description?: string;
  type: "PRODUCT" | "SERVICE";
  color?: string;
  active?: boolean;
  parentId?: string | null;
  children?: Category[];
  _count?: {
    products: number;
    services: number;
  };
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  barcode?: string;
  description?: string;
  categoryId: string;
  category?: Category;
  businessId?: string;
  stock: number;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
  wholesalePrice?: number;
  imageUrl?: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  businessId?: string;
  sku: string;
  name: string;
  barcode?: string;
  categoryId: string;
  description?: string;
  imageUrl?: string;
  stock: number;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
  wholesalePrice?: number;
  // active: boolean;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
