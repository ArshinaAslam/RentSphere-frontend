


import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { adminService } from '@/services/adminService';

import type {  ErrorPayload,Tenant,Landlord, AdminPropertiesResponse, FetchAdminPropertiesParams } from './types';

export interface FetchParams {
  search?: string;
  page?: number;
  limit?: number;
   role?: 'TENANT' | 'LANDLORD'; 
}

export interface SingleLandlordResponse {
  success: boolean;
  message: string;
  data: Landlord;  
}

export const fetchTenantsAsync = createAsyncThunk<
 {
    success: boolean;
    message: string;
    data: {
      users: Tenant[];
      total: number;
      totalPages: number;
      page: number;
    };
  },
  FetchParams,
  { rejectValue: ErrorPayload }
>(
  'admin/fetchTenants',
  async ({ search = '', page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      
      const result = await adminService.getTenantsList({ search, page, limit,role: 'TENANT' });
      
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Failed to fetch users',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);




export const toggleTenantStatusAsync = createAsyncThunk<
  Tenant,
  { id: string; status: 'active' | 'blocked' },
  { rejectValue: ErrorPayload }
>(
  'admin/toggleTenantStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const result = await adminService.toggleTenantStatus({ id, status });
     
      return result.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Failed to update status',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const toggleLandlordStatusAsync = createAsyncThunk<
  Landlord,
  { landlordId: string; status: 'active' | 'blocked' },
  { rejectValue: ErrorPayload }
>(
  'admin/toggleLandlordStatus',
  async ({ landlordId, status }, { rejectWithValue }) => {
    try {
      const result = await adminService.toggleLandlordStatus({ landlordId, status });
      
      return result.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Failed to update status',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const fetchLandlordsAsync = createAsyncThunk<
  {
    success: boolean;
    message: string;
    data: {
      users: Landlord[];  
      total: number;
      totalPages: number;
      page: number;
    };
  },
  FetchParams,
  { rejectValue: ErrorPayload }
>(
  'admin/fetchLandlords',
  async ({ search = '', page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
     
      const result = await adminService.getLandlordsList({ search, page, limit, role: 'LANDLORD' });
      
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Failed to fetch landlords',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);





export const fetchSingleLandlordAsync = createAsyncThunk<
  SingleLandlordResponse,  
  string,                  
  { rejectValue: ErrorPayload }
>(
  'admin/fetchSingleLandlord',
  async (landlordId, { rejectWithValue }) => {
    try {
     
      const result = await adminService.getLandlordById(landlordId);
     
     return result
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Failed to fetch landlord details',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);



export const approveLandlordKycAsync = createAsyncThunk<
  { id: string; kycStatus: string; status: string },  
  { id: string },                                   
  { rejectValue: ErrorPayload }
>(
  'admin/approveLandlordKyc',
  async ({ id }, { rejectWithValue }) => {
    try {
    
      const result = await adminService.approveLandlordKyc(id);
          
    
      //   sessionStorage.setItem('kycId', result.data.kycId);
      // sessionStorage.setItem('kycStatus', result.data.kycStatus);
      // const st =sessionStorage.getItem('kycStatus')
     
      return {
        id: result.data.id,
        kycStatus: 'APPROVED',
        status: 'active' 
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Failed to approve KYC',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const rejectLandlordKycAsync = createAsyncThunk<
 { id: string; kycStatus: string },
  { id: string; reason: string },  
  { rejectValue: ErrorPayload }
>(
  'users/rejectKyc',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
     
      const result = await adminService.rejectLandlordKyc(id, reason);

      return { id: result.data.id, kycStatus: 'REJECTED' };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Failed to reject KYC',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const fetchAdminProperties = createAsyncThunk<
  AdminPropertiesResponse,
  FetchAdminPropertiesParams | undefined,
  { rejectValue: ErrorPayload }
>(
  'admin/fetchProperties',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await adminService.getPropertiesList(params);
      return result;
    } catch (error: unknown) {
       
      if (isAxiosError(error)){
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({ success: false, message: data?.message || 'Failed to fetch properties' });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);





