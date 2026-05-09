import { createAsyncThunk } from "@reduxjs/toolkit";
import {  isAxiosError } from "axios";

import type { PasswordValues } from "@/constants/authValidation";
import { profileService } from "@/services/profileService";

import type { ErrorPayload, UserProfileResponse } from "./types";





export const editTenantProfileAsync = createAsyncThunk<
  UserProfileResponse,
  FormData,
  { rejectValue: ErrorPayload }
>(
  'auth/editTenantProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const result = await profileService.editTenantProfile(formData);

      return result.data as UserProfileResponse; 
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;

        return rejectWithValue({
          success: false,
          message: data?.message || 'Profile update failed',
        });
      }

      return rejectWithValue({
        success: false,
        message: 'Network error',
      });
    }
  }
);


export const editLandlordProfileAsync = createAsyncThunk<
  UserProfileResponse,   
  FormData,              
  { rejectValue: ErrorPayload }
>(
  'auth/editLandlordProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const result = await profileService.editLandlordProfile(formData);
      return result.data as UserProfileResponse; 
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


export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (data: PasswordValues, { rejectWithValue }) => {
    try {
      const result = await profileService.changePassword(data); 
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message:data?.message || 'Password change failed'
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);



export const changeLandlordPasswordAsync = createAsyncThunk(
  'auth/changeLandlordPassword',
  async (data: PasswordValues, { rejectWithValue }) => {
    try {
      const result = await profileService.changeLandlordPassword(data); 
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || 'Password change failed'
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);
