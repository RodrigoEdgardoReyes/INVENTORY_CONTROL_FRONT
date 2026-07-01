export interface DashboardSummary {
  totalProducts: number;
  lowStockProducts: number;
  monthlyEntries: number;
  monthlyExits: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export interface ChartData {
  month: string;
  entries: number;
  exits: number;
}