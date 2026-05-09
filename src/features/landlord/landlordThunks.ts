import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import type { PasswordValues } from '@/constants/authValidation';
import { landlordService } from '@/services/landlordService';

import type { ChangePasswordResponse,ErrorPayload,EditProfileResponse  } from './types';


export const editLandlordProfileAsync = createAsyncThunk<
  EditProfileResponse,
  FormData,
  { rejectValue: ErrorPayload }
>(
  'landlord/editProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const result = await landlordService.editLandlordProfile(formData);
      return result ;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message:data?.message || 'Profile update failed',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);

export const changeLandlordPasswordAsync = createAsyncThunk<
  ChangePasswordResponse,
  PasswordValues,
  { rejectValue: ErrorPayload }
>(
  'landlord/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const result = await landlordService.changeLandlordPassword(data);
      return result ;
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