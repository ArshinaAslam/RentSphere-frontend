import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { paymentService } from "@/services/paymentService";

import type {
  Payment,
  DepositOrderResult,
  TenantPaymentsData,
  PaginatedLandlordPayments,
  ApiErrorResponse,
} from "./types";

export const fetchTenantPayments = createAsyncThunk(
  "payment/fetchTenantPayments",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
      status?: string;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await paymentService.getTenantPayments(params);

      const responseData = res.data as { data: TenantPaymentsData };
      return responseData.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        return rejectWithValue(data?.message || "Failed to fetch payments");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const createDepositOrderThunk = createAsyncThunk(
  "payment/createDepositOrder",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await paymentService.createDepositOrder(leaseId);
      // return res.data as DepositOrderResult;
      return (res.data as { data: DepositOrderResult }).data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        return rejectWithValue(data?.message || "Failed to create order");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const createRentOrderThunk = createAsyncThunk(
  "payment/createRentOrder",
  async (
    { leaseId, month, year }: { leaseId: string; month: number; year: number },
    { rejectWithValue },
  ) => {
    try {
      const res = await paymentService.createRentOrder(leaseId, month, year);
      // return res.data as DepositOrderResult;
      return (res.data as { data: DepositOrderResult }).data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        return rejectWithValue(data?.message || "Failed to create rent order");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const verifyPaymentThunk = createAsyncThunk(
  "payment/verifyPayment",
  async (
    data: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      paymentId: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await paymentService.verifyPayment(data);

      return (res.data as { data: { payment: Payment } }).data.payment;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        return rejectWithValue(data?.message || "Failed to verify payments");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const fetchLandlordPayments = createAsyncThunk(
  "payment/fetchLandlordPayments",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
      status?: string;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const res = await paymentService.getLandlordPayments(params);

      const responseData = res.data as { data: PaginatedLandlordPayments };
      return responseData.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        return rejectWithValue(data?.message || "Failed to fetch payments");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const fetchPaymentsByProperty = createAsyncThunk(
  "payment/fetchPaymentsByProperty",
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const res = await paymentService.getPaymentsByProperty(propertyId);
      return res.data as Payment[];
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        return rejectWithValue(data?.message || "Failed");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const fetchPaymentById = createAsyncThunk<Payment, string>(
  "payment/fetchPaymentById",
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const res = await paymentService.getPaymentById(paymentId);
      const responseData = res.data as { data: { payment: Payment } };
      return responseData.data.payment;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        return rejectWithValue(data?.message || "Failed");
      }
      return rejectWithValue("Network error");
    }
  },
);
