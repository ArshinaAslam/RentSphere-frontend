// src/features/kyc/kycThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, isAxiosError } from "axios";
import { kycService } from "@/services/kycService";

export const submitLandlordKYC = createAsyncThunk(
  'kyc/submitLandlordKYC',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const result = await kycService.submitLandlordKYC(formData);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ 
          success: false, 
          message: error.response?.data?.message || 'KYC submission failed' 
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const fetchKycStatusAsync = createAsyncThunk(
  'kyc/fetchKycStatus',
  async (email: string, { rejectWithValue }) => {
    try {
      console.log('Fetching KYC status for:', email);
      const result = await kycService.fetchKycStatus(email);
      console.log("ooooo00",result)
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to fetch KYC status',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);
