
import { createSlice } from "@reduxjs/toolkit";

import {
  fetchRevenueStats,
  fetchMonthlyTrend,
  fetchAllTransactions,
} from "./adminRevenueThunk";

import type {
  RevenueStatsDto,
  MonthlyRevenueDto,
  AdminTransactionDto,
} from "./types";

interface AdminRevenueState {
  stats: RevenueStatsDto | null;
  trend: MonthlyRevenueDto[];
  transactions: AdminTransactionDto[];
  total: number;
  page: number;
  limit: number;
  isLoadingStats: boolean;
  isLoadingTrend: boolean;
  isLoadingTransactions: boolean;
  error: string | null;
}

const initialState: AdminRevenueState = {
  stats: null,
  trend: [],
  transactions: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoadingStats: false,
  isLoadingTrend: false,
  isLoadingTransactions: false,
  error: null,
};

const adminRevenueSlice = createSlice({
  name: "adminRevenue",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // stats
      .addCase(fetchRevenueStats.pending,  (state) => { state.isLoadingStats = true;  state.error = null; })
      .addCase(fetchRevenueStats.fulfilled, (state, action) => { state.isLoadingStats = false; state.stats = action.payload; })
      .addCase(fetchRevenueStats.rejected,  (state, action) => { state.isLoadingStats = false; state.error = action.payload?.message ?? "Error"; })

      // trend
      .addCase(fetchMonthlyTrend.pending,  (state) => { state.isLoadingTrend = true;  state.error = null; })
      .addCase(fetchMonthlyTrend.fulfilled, (state, action) => { state.isLoadingTrend = false; state.trend = action.payload; })
      .addCase(fetchMonthlyTrend.rejected,  (state, action) => { state.isLoadingTrend = false; state.error = action.payload?.message ?? "Error"; })

      // transactions
      .addCase(fetchAllTransactions.pending,  (state) => { state.isLoadingTransactions = true;  state.error = null; })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.isLoadingTransactions = false;
        state.transactions = action.payload.data;
        state.total        = action.payload.total;
        state.page         = action.payload.page;
        state.limit        = action.payload.limit;
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => { state.isLoadingTransactions = false; state.error = action.payload?.message ?? "Error"; });
  },
});

export default adminRevenueSlice.reducer;