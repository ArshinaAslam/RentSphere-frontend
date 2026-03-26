import { createAsyncThunk } from '@reduxjs/toolkit';

import { paymentService } from '@/services/paymentService';

import type { Payment, DepositOrderResult } from './types';

export const fetchTenantPayments = createAsyncThunk(
  'payment/fetchTenantPayments',
  async (
    params: { page?: number; limit?: number; search?: string; type?: string; status?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await paymentService.getTenantPayments(params);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const createDepositOrderThunk = createAsyncThunk(
  'payment/createDepositOrder',
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await paymentService.createDepositOrder(leaseId);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

export const createRentOrderThunk = createAsyncThunk(
  'payment/createRentOrder',
  async (
    { leaseId, month, year }: { leaseId: string; month: number; year: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await paymentService.createRentOrder(leaseId, month, year);
      return res.data.data as DepositOrderResult;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create rent order');
    }
  }
);

export const verifyPaymentThunk = createAsyncThunk(
  'payment/verifyPayment',
  async (
    data: {
      razorpayOrderId:   string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      paymentId:         string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await paymentService.verifyPayment(data);
      return res.data.data.payment as Payment;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to verify payment');
    }
  }
);


export const fetchLandlordPayments = createAsyncThunk(
  'payment/fetchLandlordPayments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await paymentService.getLandlordPayments();
      return (res.data.data?.payments ?? []) as Payment[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const fetchPaymentsByProperty = createAsyncThunk(
  'payment/fetchPaymentsByProperty',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      const res = await paymentService.getPaymentsByProperty(propertyId);
      return (res.data.data?.payments ?? []) as Payment[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);