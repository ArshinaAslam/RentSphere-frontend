import { ADMIN_REVENUE_ROUTES } from "@/constants/adminRevenueRoutes";
import type {
  GetRevenueStatsParams,
  GetTransactionsParams,
  GetTrendParams,
  MonthlyRevenueDto,
  PaginatedTransactionsDto,
  RevenueStatsDto,
} from "@/features/adminRevenue/types";

import axiosInstance from "./axios";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const adminRevenueService = {
  getRevenueStats: (params?: GetRevenueStatsParams) =>
    axiosInstance.get<ApiResponse<RevenueStatsDto>>(
      ADMIN_REVENUE_ROUTES.STATS,
      { params },
    ),

  getMonthlyTrend: (params?: GetTrendParams) =>
    axiosInstance.get<ApiResponse<MonthlyRevenueDto[]>>(
      ADMIN_REVENUE_ROUTES.TREND,
      { params },
    ),

  getAllTransactions: (params?: GetTransactionsParams) =>
    axiosInstance.get<ApiResponse<PaginatedTransactionsDto>>(
      ADMIN_REVENUE_ROUTES.TRANSACTIONS,
      { params },
    ),
};
