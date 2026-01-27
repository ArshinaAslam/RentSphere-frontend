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
