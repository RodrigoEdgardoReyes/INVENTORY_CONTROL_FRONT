// Resumen del dashboard
export interface DashboardSummary {
  // Métricas principales
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  totalCustomers: number;
  totalPurchases: number;
  totalExpenses: number;
  netProfit: number;
  
  // Resumen de hoy
  todaySales: number;
  todayRevenue: number;
  todayCustomers: number;
  
  // Comparativas
  salesGrowth: number; // porcentaje
  revenueGrowth: number; // porcentaje
  
  // Listados
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  topProducts: TopProduct[];
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'shipped';
  date: string;
  items: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  category: string;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image?: string;
}

// Datos para gráficos
export interface ChartData {
  labels: string[]; // Para gráficos de barras/líneas
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  fill?: boolean;
}

// Para datos simples de gráficos
export interface SimpleChartData {
  name: string;
  value: number;
  color?: string;
}

// Para gráficos de línea temporal
export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

// Para KPIs
export interface KPIData {
  title: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon?: string;
  color?: string;
}