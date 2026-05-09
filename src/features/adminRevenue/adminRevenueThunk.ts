import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { adminRevenueService } from '@/services/adminRevenueService';

import type {
  GetRevenueStatsParams,
  GetTransactionsParams,
  GetTrendParams,
  MonthlyRevenueDto,
  PaginatedTransactionsDto,
  RevenueStatsDto,
} from './types';

type RejectValue = { success: false; message: string };

export const fetchRevenueStats = createAsyncThunk<
  RevenueStatsDto,
  GetRevenueStatsParams | undefined,
  { rejectValue: RejectValue }
>('adminRevenue/fetchStats', async (params, { rejectWithValue }) => {
  try {
    const res = await adminRevenueService.getRevenueStats(params);
    return res.data.data;
    
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({ success: false, message: data?.message ?? 'Failed' });
    }
    return rejectWithValue({ success: false, message: 'Network error' });
  }
});

export const fetchMonthlyTrend = createAsyncThunk<
  MonthlyRevenueDto[],
  GetTrendParams | undefined,
  { rejectValue: RejectValue }
>('adminRevenue/fetchTrend', async (params, { rejectWithValue }) => {
  try {
    const res = await adminRevenueService.getMonthlyTrend(params);
    return res.data.data;
    
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({ success: false, message: data?.message ?? 'Failed to fetch trend' });
    }
    return rejectWithValue({ success: false, message: 'Network error' });
  }
});

export const fetchAllTransactions = createAsyncThunk<
  PaginatedTransactionsDto,
  GetTransactionsParams | undefined,
  { rejectValue: RejectValue }
>('adminRevenue/fetchTransactions', async (params, { rejectWithValue }) => {
  try {
    const res = await adminRevenueService.getAllTransactions(params);
    return res.data.data;
    
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({ success: false, message: data?.message ?? 'Failed to fetch transactions' });
    }
    return rejectWithValue({ success: false, message: 'Network error' });
  }
});