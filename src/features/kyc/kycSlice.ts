import { createSlice } from "@reduxjs/toolkit";

import { fetchKycStatusAsync, submitLandlordKYC } from "./kycThunks";

import type { KycState } from "./types";

const initialState: KycState = {
  status: "idle",
  error: null,
  kycId: null,
  kycStatus: null,
  kycRejectedReason: null,
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
      state.status = "idle";
      state.error = null;
      state.kycId = null;
      state.kycStatus = null;
      state.kycData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLandlordKYC.pending, (state) => {
        
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitLandlordKYC.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kycId = action.payload.data.kycId;
        state.kycStatus = action.payload.data.kycStatus;
        state.kycRejectedReason = action.payload.data.kycRejectedReason;
        state.kycData = action.payload.data;
        
        state.error = null;
      })
      .addCase(submitLandlordKYC.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "KYC submission failed";
        
      })

      .addCase(fetchKycStatusAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchKycStatusAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.kycId = action.payload.data.kycId;
        state.kycStatus = action.payload.data.kycStatus;
        state.kycRejectedReason = action.payload.data.kycRejectedReason;
      })
      .addCase(fetchKycStatusAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Failed to fetch KYC status";
        
      });
  },
});

export const { clearKycError, resetKyc } = kycSlice.actions;
export default kycSlice.reducer;