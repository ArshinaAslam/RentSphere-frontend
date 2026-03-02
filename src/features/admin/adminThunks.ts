


import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, isAxiosError } from 'axios';

import { adminService } from '@/services/adminService';

import type {  ErrorPayload,Tenant,Landlord } from './types';

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
      console.log("reached for tennatlist")
      const result = await adminService.getTenantsList({ search, page, limit,role: 'TENANT' });
      console.log("listing result",result)
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to fetch users',
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
      console.log("user from thunk",result.data)
      return result.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to update status',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const toggleLandlordStatusAsync = createAsyncThunk<
  Tenant,
  { id: string; status: 'active' | 'blocked' },
  { rejectValue: ErrorPayload }
>(
  'admin/toggleLandlordStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const result = await adminService.toggleLandlordStatus({ id, status });
      console.log("user from thunk",result.data)
      return result.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to update status',
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
      console.log("reached for landlord list");
      const result = await adminService.getLandlordsList({ search, page, limit, role: 'LANDLORD' });
      console.log("landlord listing result", result);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to fetch landlords',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);

// export const approveKycAsync = createAsyncThunk<
//   { id: string },
//   { id: string },
//   { rejectValue: ErrorPayload }
// >(
//   'users/approveKyc',
//   async ({ id }, { rejectWithValue }) => {
//     try {
//       const result = await userService.approveKyc(id);
//       return { id };
//     } catch (error: unknown) {
//       if (isAxiosError(error)) {
//         return rejectWithValue({
//           success: false,
//           message: error.response?.data?.message || 'Failed to approve KYC',
//         });
//       }
//       return rejectWithValue({ success: false, message: 'Network error' });
//     }
//   }
// );

// export const rejectKycAsync = createAsyncThunk<
//   { id: string },
//   { id: string },
//   { rejectValue: ErrorPayload }
// >(
//   'users/rejectKyc',
//   async ({ id }, { rejectWithValue }) => {
//     try {
//       const result = await userService.rejectKyc(id);
//       return { id };
//     } catch (error: unknown) {
//       if (isAxiosError(error)) {
//         return rejectWithValue({
//           success: false,
//           message: error.response?.data?.message || 'Failed to reject KYC',
//         });
//       }
//       return rejectWithValue({ success: false, message: 'Network error' });
//     }
//   }
// );




export const fetchSingleLandlordAsync = createAsyncThunk<
  SingleLandlordResponse,  
  string,                  
  { rejectValue: ErrorPayload }
>(
  'admin/fetchSingleLandlord',
  async (landlordId, { rejectWithValue }) => {
    try {
      console.log("Fetching single landlord:", landlordId);
      const result = await adminService.getLandlordById(landlordId);
      console.log("Single landlord result:", result);
     return result
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to fetch landlord details',
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
      console.log("Approving KYC for landlord:", id);
      const result = await adminService.approveLandlordKyc(id);
            console.log("Ri",result)
      console.log("idRi",result.data.id)
      console.log("statusRi",result.data.kycStatus)
        sessionStorage.setItem('kycId', result.data.kycId);
      sessionStorage.setItem('kycStatus', result.data.kycStatus);
      const st =sessionStorage.getItem('kycStatus')
      console.log("poy",st)
      console.log("KYC approve result:", result);
      return {
        id: result.data.id,
        kycStatus: 'APPROVED',
        status: 'active' 
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to approve KYC',
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
      console.log("Rejecting KYC:", id, reason);
      const result = await adminService.rejectLandlordKyc(id, reason);

      return { id: result.data.id, kycStatus: 'REJECTED' };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to reject KYC',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);



