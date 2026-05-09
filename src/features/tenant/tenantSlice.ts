import { createSlice } from '@reduxjs/toolkit';

import { changePasswordAsync, editTenantProfileAsync } from './tenantThunks';

import type { ErrorPayload, TenantState } from './types';


const initialState: TenantState = {
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    clearTenantError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editTenantProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTenantProfileAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editTenantProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorPayload)?.message || 'Profile update failed';
      })

      .addCase(changePasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ErrorPayload)?.message || 'Password change failed';
      });
  },
});

export const { clearTenantError } = tenantSlice.actions;
export default tenantSlice.reducer;