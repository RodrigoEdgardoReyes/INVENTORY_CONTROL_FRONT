export interface Movement {
  id: string;
  type: 'ENTRY' | 'EXIT';
  productId: string;
  product?: {
    id: string;
    sku: string;
    name: string;
  };
  quantity: number;
  unitPrice: number;
  total: number;
  reason: string;
  reference?: string;
  notes?: string;
  userId: string;
  user?: {
    id: string;
    name: string;
  };
  createdAt: Date;
}

export interface EntryForm {
  productId: string;
  quantity: number;
  unitPrice: number;
  reason: string;
  reference?: string;
  notes?: string;
}

export interface ExitForm {
  productId: string;
  quantity: number;
  unitPrice: number;
  reason: string;
  reference?: string;
  notes?: string;
}

export interface MovementFilters {
  startDate: Date | null;
  endDate: Date | null;
  type: 'ENTRY' | 'EXIT' | '';
  productId: string;
  page: number;
  limit: number;
}

export interface MovementPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}