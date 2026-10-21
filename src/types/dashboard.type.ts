export interface DashboardStats {
  todayRevenue: number;
  todayServices: number;
  todayProducts: number;
  todayProfit: number;
  totalProducts: number;
  lowStockCount: number;
}

export interface RecentMovement {
  id: string;
  type: 'SALE' | 'SERVICE' | 'PURCHASE';
  description: string;
  amount: number;
  createdAt: string;
  userName: string;
}