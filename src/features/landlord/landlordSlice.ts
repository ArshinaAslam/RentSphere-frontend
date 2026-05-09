import { createSlice } from '@reduxjs/toolkit';

import { changeLandlordPasswordAsync, editLandlordProfileAsync } from './landlordThunks';

import type { ErrorPayload, LandlordState } from './types';

const initialState: LandlordState = {
  loading: false,
  error: null,
};

const landlordSlice = createSlice({
  name: 'landlord',
  initialState,
  reducers: {
    clearLandlordError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editLandlordProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editLandlordProfileAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editLandlordProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorPayload)?.message || 'Profile update failed';
      })

      .addCase(changeLandlordPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeLandlordPasswordAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeLandlordPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorPayload)?.message || 'Password change failed';
      });
  },
});

export const { clearLandlordError } = landlordSlice.actions;
export default landlordSlice.reducer;