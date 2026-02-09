// // store/kycSlice.ts
// import { createSlice } from "@reduxjs/toolkit";
// import { submitLandlordKYC } from "./kycThunks";
// import { KycState } from "./types";

// const initialState: KycState = {
//   status: 'idle',        // 'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null,
//   kycData: null,
// };

// const kycSlice = createSlice({
//   name: "kyc",
//   initialState,
//   reducers: {
//     clearKycError: (state) => {
//       state.error = null;
//     },
//     resetKyc: (state) => {
//       state.status = 'idle';
//       state.error = null;
//       state.kycData = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
      
//       .addCase(submitLandlordKYC.pending, (state) => ({
//         ...state,
//         status: 'loading',
//         error: null,
//       }))
//       .addCase(submitLandlordKYC.fulfilled, (state, action) => ({
//         ...state,
//         status: 'succeeded',
//         // kycData: action.payload,
//         kycId : action.payload.data.kycId,
//         error: null,
//       }))
//       .addCase(submitLandlordKYC.rejected, (state, action) => ({
//         ...state,
//         status: 'failed',
//         error: (action.payload as any)?.message || "KYC submission failed",
//       }));
//   },
// });

// export const { clearKycError, resetKyc } = kycSlice.actions;
// export default kycSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import { fetchKycStatusAsync, submitLandlordKYC } from "./kycThunks";
import { KycState } from "./types";

const initialState: KycState = {
  status: 'idle',
  error: null,
  kycId: null,       
  kycStatus: null,
  kycRejectedReason:null,
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
      state.kycId = null;
      state.kycStatus = null;
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
        kycId: action.payload.data.kycId,     
        kycStatus: action.payload.data.kycStatus,  
        kycRejectedReason:action.payload.data.kycRejectedReason, 
        kycData: action.payload,          
        error: null,
      }))
      .addCase(submitLandlordKYC.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: (action.payload as any)?.message || "KYC submission failed",
      }))

      .addCase(fetchKycStatusAsync.pending, (state) => {
  state.status = 'loading';
})
.addCase(fetchKycStatusAsync.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.kycId = action.payload.data.data.kycId;
  state.kycStatus = action.payload.data.data.kycStatus;
  state.kycRejectedReason=action.payload.data.data.kycRejectedReason;
})
.addCase(fetchKycStatusAsync.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.payload as string;
});

  },
});

export const { clearKycError, resetKyc } = kycSlice.actions;
export default kycSlice.reducer;
