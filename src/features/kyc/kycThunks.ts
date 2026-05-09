
import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { kycService } from "@/services/kycService";

import type {
  KycSubmitApiResponse,
  KycStatusApiResponse,
  KycRejectPayload,
} from "./types";

export const submitLandlordKYC = createAsyncThunk<
  KycSubmitApiResponse,  
  FormData,              
  { rejectValue: KycRejectPayload }  
>(
  "kyc/submitLandlordKYC",
  async (formData, { rejectWithValue }) => {
    try {
      const result = await kycService.submitLandlordKYC(formData);
      return result;
      
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message ?? "KYC submission failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  }
);

export const fetchKycStatusAsync = createAsyncThunk<
  KycStatusApiResponse, 
  string,               
  { rejectValue: KycRejectPayload }
>(
  "kyc/fetchKycStatus",
  async (email, { rejectWithValue }) => {
    try {
      const result = await kycService.fetchKycStatus(email);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message ?? "Failed to fetch KYC status",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  }
);