
export interface RevenueStatsDto {
  totalRevenue: number;
  totalVolume: number;
  totalCount: number;
  depositRevenue: number;
  rentRevenue: number;
  thisMonthRevenue: number;
  thisMonthVolume: number;
}

export interface MonthlyRevenueDto {
  month: number;
  year: number;
  revenue: number;
  volume: number;
  count: number;
}

export interface AdminTransactionDto {
  _id: string;
  leaseId: string;
  tenantId: string;
  landlordId: string;
   propertyId: string;
  type: 'deposit' | 'rent' | 'late_fee' | 'refund';
  amount: number;
  platformFee: number;
  landlordAmount: number;
  status: 'pending' | 'completed' | 'failed';
  month?: number;
  year?: number;
  paidAt?: string;
  dueDate?: string;
  createdAt: string;
}

export interface PaginatedTransactionsDto {
  data: AdminTransactionDto[];
  total: number;
  page: number;
  limit: number;
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  search?: string;
}

export interface GetTrendParams {
  months?: number;
}

export interface GetRevenueStatsParams {
  from?: string;
  to?: string;
}