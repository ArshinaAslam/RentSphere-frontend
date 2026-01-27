// store/kycSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { submitLandlordKYC } from "./kycThunks";
import { KycState } from "./types";

const initialState: KycState = {
  status: 'idle',        // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  kycData: null,
};

const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    clearKycError: (state) => {
      state.error = null;
    },
    resetKyc: (state) => {
      state.status = 'idle';
      state.error = null;
      state.kycData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(submitLandlordKYC.pending, (state) => ({
        ...state,
        status: 'loading',
        error: null,
      }))
      .addCase(submitLandlordKYC.fulfilled, (state, action) => ({
        ...state,
        status: 'succeeded',
        kycData: action.payload,
        error: null,
      }))
      .addCase(submitLandlordKYC.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: (action.payload as any)?.message || "KYC submission failed",
      }));
  },
});

export const { clearKycError, resetKyc } = kycSlice.actions;
export default kycSlice.reducer;
