import { createSlice } from '@reduxjs/toolkit';

import {
  fetchTenantPayments,
  createDepositOrderThunk,
  createRentOrderThunk,
  verifyPaymentThunk,
  fetchLandlordPayments,
} from './paymentThunk';

import type { PaymentState } from './types';

const initialState: PaymentState = {
  payments:     [],
   pagination:   { total: 0, page: 1, totalPages: 1 },
  isLoading:    false,
  isProcessing: false,
  error:        null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // fetch payments
      .addCase(fetchTenantPayments.pending,   (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTenantPayments.fulfilled, (state, action) => {
  state.isLoading  = false;
  state.payments   = action.payload.payments;
  state.pagination = {
    total:      action.payload.total,
    page:       action.payload.page,
    totalPages: action.payload.totalPages,
  };
})
      .addCase(fetchTenantPayments.rejected,  (state, action) => {
        state.isLoading = false;
        state.error     = action.payload as string;
      })

      // create deposit order
      .addCase(createDepositOrderThunk.pending,  (state) => { state.isProcessing = true; })
      .addCase(createDepositOrderThunk.fulfilled, (state) => { state.isProcessing = false; })
      .addCase(createDepositOrderThunk.rejected,  (state, action) => {
        state.isProcessing = false;
        state.error        = action.payload as string;
      })

      // create rent order
      .addCase(createRentOrderThunk.pending,  (state) => { state.isProcessing = true; })
      .addCase(createRentOrderThunk.fulfilled, (state) => { state.isProcessing = false; })
      .addCase(createRentOrderThunk.rejected,  (state, action) => {
        state.isProcessing = false;
        state.error        = action.payload as string;
      })

      // verify payment
      .addCase(verifyPaymentThunk.pending,   (state) => { state.isProcessing = true; })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.isProcessing = false;
        // update payment in list if exists, else add it
        const idx = state.payments.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.payments[idx] = action.payload;
        else            state.payments.unshift(action.payload);
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.isProcessing = false;
        state.error        = action.payload as string;
      })

      
.addCase(fetchLandlordPayments.pending,   (state) => { state.isLoading = true; })
.addCase(fetchLandlordPayments.fulfilled, (state, action) => {
  state.isLoading  = false;
  state.payments   = action.payload;
})
.addCase(fetchLandlordPayments.rejected,  (state) => { state.isLoading = false; })
  },
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;