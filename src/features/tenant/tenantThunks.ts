import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import type { PasswordValues } from '@/constants/authValidation';
import { tenantService } from '@/services/tenantService';

import type { ChangePasswordResponse, EditProfileResponse, ErrorPayload } from './types';



export const editTenantProfileAsync = createAsyncThunk<
  EditProfileResponse,
  FormData,
  { rejectValue: ErrorPayload }
>(
  'tenant/editProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const result = await tenantService.editTenantProfile(formData);
      return result ;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Profile update failed',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);

export const changePasswordAsync = createAsyncThunk<
  ChangePasswordResponse,
  PasswordValues,
  { rejectValue: ErrorPayload }
>(
  'tenant/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const result = await tenantService.changePassword(data);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Password change failed',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);