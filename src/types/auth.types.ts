export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MANAGER' | 'EMPLOYEE' | 'VIEWER';
  businessId?: string;
  business?: {
    id: string;
    name: string;
    businessType: string;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  businessType: string;
  businessName: string;
  planId: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  business?: {
    id: string;
    name: string;
    businessType: string;
  };
  subscription?: {
    id: string;
    planId: string;
    planName: string;
    level: string;
    features: string[];
  };
}

export interface BusinessType {
  id: string;
  name: string;
  value: string;
  icon: string;
  description: string;
}