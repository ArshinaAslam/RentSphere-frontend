import { createAsyncThunk } from '@reduxjs/toolkit';

import {  leaseService } from '@/services/leaseService';

import type { CreateLeasePayload, Lease, UpdateLeasePayload } from './types';

// ── Landlord thunks ──
// export const fetchLandlordLeases = createAsyncThunk(
//   'lease/fetchLandlordLeases',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await leaseService.getAllLeases();
//       return res.data.leases
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data?.message || 'Failed to fetch leases');
//     }
//   }
// );

export const fetchLandlordLeases = createAsyncThunk(
  'lease/fetchLandlordLeases',
  async (
    { page = 1, limit = 10, search = "" }: { page?: number; limit?: number; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await leaseService.getAllLeases(page, limit, search);
    
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch leases');
    }
  }
);

export const fetchLeaseById = createAsyncThunk(
  'lease/fetchLeaseById',
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.getLeaseById(leaseId);
      return res.data.lease 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch lease');
    }
  }
);

export const createLeaseThunk = createAsyncThunk(
  'lease/create',
  async (data: CreateLeasePayload, { rejectWithValue }) => {
    try {
      const res = await leaseService.createLease(data);
      console.log("res.data",res.data)
      return res.data.lease 
    } catch (err: any) {
    
      return rejectWithValue(err.response?.data?.message || 'Failed to create lease');
    }
  }
);

export const updateLeaseThunk = createAsyncThunk(
  'lease/update',
  async ({ leaseId, data }: { leaseId: string; data: UpdateLeasePayload }, { rejectWithValue }) => {
    try {
      const res = await leaseService.updateLease(leaseId, data);
      return res.data.lease 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update lease');
    }
  }
);

export const sendLeaseThunk = createAsyncThunk(
  'lease/send',
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.sendLease(leaseId);
      return res.data.data.lease as Lease;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send lease');
    }
  }
);

export const terminateLeaseThunk = createAsyncThunk(
  'lease/terminate',
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.terminateLease(leaseId);
      return res.data.data.lease as Lease;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to terminate lease');
    }
  }
);

export const deleteLeaseThunk = createAsyncThunk(
  'lease/delete',
  async (leaseId: string, { rejectWithValue }) => {
    try {
      await leaseService.deleteLease(leaseId);
      return leaseId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete lease');
    }
  }
);

export const fetchLandlordProperties = createAsyncThunk(
  'lease/fetchLandlordProperties',
  async (_, { rejectWithValue }) => {
    try {
      const res = await leaseService.getProperties();
      
      const data = (res.data?.properties ?? []) 
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

export const searchTenantsThunk = createAsyncThunk(
  'lease/searchTenants',
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.searchTenants(query);
       console.log('search tenants raw response:', res);
      return (res.data?.tenants ?? []) 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to search tenants');
    }
  }
);

export const signLeaseAsLandlordThunk = createAsyncThunk(
  'lease/signAsLandlord',
  async ({ leaseId, signatureName }: { leaseId: string; signatureName: string }, { rejectWithValue }) => {
    try {
      const res = await leaseService.signLeaseAsLandlord(leaseId, signatureName);
      console.log("res.thunk",res)
      return res.data.lease;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to sign lease');
    }
  }
);

// ── Tenant thunks ──
export const fetchTenantLeases = createAsyncThunk(
  'lease/fetchTenantLeases',
  async (_, { rejectWithValue }) => {
    try {
      const res = await leaseService.getTenantLeases();
      return res.data.leases 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch leases');
    }
  }
);

export const fetchTenantLeaseById = createAsyncThunk(
  'lease/fetchTenantLeaseById',
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.getTenantLeaseById(leaseId);
      return res.data.lease 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch lease');
    }
  }
);

export const markLeaseAsViewedThunk = createAsyncThunk(
  'lease/markAsViewed',
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.markLeaseAsViewed(leaseId);
      return res.data.data.lease as Lease;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);

export const signLeaseThunk = createAsyncThunk(
  'lease/sign',
  async ({ leaseId, signatureName }: { leaseId: string; signatureName: string }, { rejectWithValue }) => {
    try {
      const res = await leaseService.signLease(leaseId, signatureName);
      return res.data.lease 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to sign lease');
    }
  }
);