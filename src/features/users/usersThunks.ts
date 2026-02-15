// import { createAsyncThunk } from '@reduxjs/toolkit';
// import { AxiosError, isAxiosError } from 'axios';
// import { userService } from '@/services/UserService';
// import {  ErrorPayload,Tenant } from './types';

// export interface FetchParams {
//   search?: string;
//   page?: number;
//   limit?: number;
//    role?: 'TENANT' | 'LANDLORD'; 
// }



// export const fetchUsersAsync = createAsyncThunk<
//  {
//     success: boolean;
//     message: string;
//     data: {
//       users: Tenant[];
//       total: number;
//       totalPages: number;
//       page: number;
//     };
//   },
//   FetchParams,
//   { rejectValue: ErrorPayload }
// >(
//   'users/fetchUsers',
//   async ({ search = '', page = 1, limit = 10 }, { rejectWithValue }) => {
//     try {
//       console.log("reached for tennatlist")
//       const result = await userService.getTenantsList({ search, page, limit,role: 'TENANT' });
//       console.log("listing result",result)
//       return result;
//     } catch (error: unknown) {
//       if (isAxiosError(error)) {
//         return rejectWithValue({
//           success: false,
//           message: error.response?.data?.message || 'Failed to fetch users',
//         });
//       }
//       return rejectWithValue({ success: false, message: 'Network error' });
//     }
//   }
// );

// export const toggleUserStatusAsync = createAsyncThunk<
//   Tenant,
//   { id: string; status: 'active' | 'blocked' },
//   { rejectValue: ErrorPayload }
// >(
//   'users/toggleUserStatus',
//   async ({ id, status }, { rejectWithValue }) => {
//     try {
//       const result = await userService.toggleTenantStatus({ id, status });
//       console.log("user from thunk",result.data)
//       return result.data;
//     } catch (error: unknown) {
//       if (isAxiosError(error)) {
//         return rejectWithValue({
//           success: false,
//           message: error.response?.data?.message || 'Failed to update status',
//         });
//       }
//       return rejectWithValue({ success: false, message: 'Network error' });
//     }
//   }
// );



import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, isAxiosError } from 'axios';
import { userService } from '@/services/UserService';
import {  ErrorPayload,Tenant,Landlord } from './types';

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

export const fetchUsersAsync = createAsyncThunk<
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
  'users/fetchUsers',
  async ({ search = '', page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      console.log("reached for tennatlist")
      const result = await userService.getTenantsList({ search, page, limit,role: 'TENANT' });
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

export const toggleUserStatusAsync = createAsyncThunk<
  Tenant,
  { id: string; status: 'active' | 'blocked' },
  { rejectValue: ErrorPayload }
>(
  'users/toggleUserStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const result = await userService.toggleStatus({ id, status });
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
      users: Landlord[];  // ✅ Different field name
      total: number;
      totalPages: number;
      page: number;
    };
  },
  FetchParams,
  { rejectValue: ErrorPayload }
>(
  'users/fetchLandlords',
  async ({ search = '', page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      console.log("reached for landlord list");
      const result = await userService.getLandlordsList({ search, page, limit, role: 'LANDLORD' });
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
  SingleLandlordResponse,  // Return type
  string,                  // Arg: landlordId
  { rejectValue: ErrorPayload }
>(
  'users/fetchSingleLandlord',
  async (landlordId, { rejectWithValue }) => {
    try {
      console.log("Fetching single landlord:", landlordId);
      const result = await userService.getLandlordById(landlordId);
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


// ✅ APPROVE KYC THUNK
export const approveKycAsync = createAsyncThunk<
  { id: string; kycStatus: string; status: string },  // Return type
  { id: string },                                    // Arg type
  { rejectValue: ErrorPayload }
>(
  'users/approveKyc',
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("Approving KYC for landlord:", id);
      const result = await userService.approveKyc(id);
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
        status: 'active'  // ✅ Set isActive: true
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


export const rejectKycAsync = createAsyncThunk<
 { id: string; kycStatus: string },
  { id: string; reason: string },  
  { rejectValue: ErrorPayload }
>(
  'users/rejectKyc',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      console.log("Rejecting KYC:", id, reason);
      const result = await userService.rejectKyc(id, reason);

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



