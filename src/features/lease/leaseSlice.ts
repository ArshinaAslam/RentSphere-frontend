import { createSlice } from '@reduxjs/toolkit';

import {
  fetchLandlordLeases, fetchLeaseById, createLeaseThunk,
  updateLeaseThunk, sendLeaseThunk, terminateLeaseThunk,
  deleteLeaseThunk, fetchTenantLeases, fetchTenantLeaseById,
  markLeaseAsViewedThunk, signLeaseThunk,
  signLeaseAsLandlordThunk,
} from './leaseThunk';

import type { LeaseState } from './types';

const initialState: LeaseState = {
  leases:       [],
  activeLease:  null,
  isLoading:    false,
  isSubmitting: false,
  error:        null,
   pagination: { total: 0, page: 1, totalPages: 1 },
};

const leaseSlice = createSlice({
  name: 'lease',
  initialState,
  reducers: {
    clearActiveLease: (state) => { state.activeLease = null; },
    clearError:       (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // fetch landlord leases
      .addCase(fetchLandlordLeases.pending,   (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLandlordLeases.fulfilled, (state, action) => { state.isLoading = false; state.leases = Array.isArray(action.payload.leases) ? action.payload.leases : [];; state.pagination = {
    total:      action.payload.total,
    page:       action.payload.page,
    totalPages: action.payload.totalPages,
  }; })
      .addCase(fetchLandlordLeases.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload as string; })

      // fetch lease by id
      .addCase(fetchLeaseById.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchLeaseById.fulfilled, (state, action) => { state.isLoading = false; state.activeLease = action.payload; })
      .addCase(fetchLeaseById.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload as string; })

      // create
      .addCase(createLeaseThunk.pending,   (state) => { state.isSubmitting = true; })
      .addCase(createLeaseThunk.fulfilled, (state, action) => { state.isSubmitting = false; state.leases.unshift(action.payload); })
      .addCase(createLeaseThunk.rejected,  (state, action) => { state.isSubmitting = false; state.error = action.payload as string; })

      // update
      .addCase(updateLeaseThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const idx = state.leases.findIndex(l => l._id === action.payload._id);
        if (idx !== -1) state.leases[idx] = action.payload;
        if (state.activeLease?._id === action.payload._id) state.activeLease = action.payload;
      })

      // send
      .addCase(sendLeaseThunk.fulfilled, (state, action) => {
        const idx = state.leases.findIndex(l => l._id === action.payload._id);
        if (idx !== -1) state.leases[idx] = action.payload;
        if (state.activeLease?._id === action.payload._id) state.activeLease = action.payload;
      })

      // terminate
      .addCase(terminateLeaseThunk.fulfilled, (state, action) => {
        const idx = state.leases.findIndex(l => l._id === action.payload._id);
        if (idx !== -1) state.leases[idx] = action.payload;
        if (state.activeLease?._id === action.payload._id) state.activeLease = action.payload;
      })

      // delete
      .addCase(deleteLeaseThunk.fulfilled, (state, action) => {
        state.leases = state.leases.filter(l => l._id !== action.payload);
        if (state.activeLease?._id === action.payload) state.activeLease = null;
      })

      .addCase(signLeaseAsLandlordThunk.fulfilled, (state, action) => {
  state.isSubmitting = false;
  const idx = state.leases.findIndex(l => l._id === action.payload._id);
  if (idx !== -1) state.leases[idx] = action.payload;
  if (state.activeLease?._id === action.payload._id) state.activeLease = action.payload;
})

      // fetch tenant leases
      .addCase(fetchTenantLeases.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchTenantLeases.fulfilled, (state, action) => { state.isLoading = false; state.leases = action.payload; })
      .addCase(fetchTenantLeases.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload as string; })

      // fetch tenant lease by id
      .addCase(fetchTenantLeaseById.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchTenantLeaseById.fulfilled, (state, action) => { state.isLoading = false; state.activeLease = action.payload; })
      .addCase(fetchTenantLeaseById.rejected,  (state, action) => { state.isLoading = false; state.error = action.payload as string; })

      // mark as viewed
      .addCase(markLeaseAsViewedThunk.fulfilled, (state, action) => {
        if (state.activeLease?._id === action.payload._id) state.activeLease = action.payload;
      })

      // sign
      .addCase(signLeaseThunk.pending,   (state) => { state.isSubmitting = true; })
      .addCase(signLeaseThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const idx = state.leases.findIndex(l => l._id === action.payload._id);
        if (idx !== -1) state.leases[idx] = action.payload;
        if (state.activeLease?._id === action.payload._id) state.activeLease = action.payload;
      })
      .addCase(signLeaseThunk.rejected, (state, action) => { state.isSubmitting = false; state.error = action.payload as string; });
  },
});

export const { clearActiveLease, clearError } = leaseSlice.actions;
export default leaseSlice.reducer;