import { createSlice } from "@reduxjs/toolkit";

import { changeLandlordPasswordAsync, changePasswordAsync, editLandlordProfileAsync, editTenantProfileAsync } from "../profile/profileThunk";

import type { ProfileState } from "./types";
import type { ErrorPayload } from "../auth/types";


const initialState: ProfileState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.error = null;
      state.success = false;
    },
    clearPasswordState: (state) => {
   
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

       .addCase(editTenantProfileAsync.pending, (state) => ({
      ...state,
      loading: true,
      error: null,
    }))
  
    .addCase(editTenantProfileAsync.fulfilled, (state, action) => ({
      ...state,
      loading: false,
      user: action.payload.data.user , 
      error: null,
    }))
    .addCase(editTenantProfileAsync.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: (action.payload as ErrorPayload)?.message || 'Profile update failed',
    }))

      .addCase(editLandlordProfileAsync.pending, (state) => ({
      ...state,
      loading: true,
      error: null,
    }))
  
    .addCase(editLandlordProfileAsync.fulfilled, (state, action) => ({
      ...state,
      loading: false,
      userData: action.payload.data.user , 
      error: null,
    }))
    .addCase(editLandlordProfileAsync.rejected, (state, action) => ({
      ...state,
      loading: false,
      error: (action.payload as ErrorPayload)?.message || 'Profile update failed',
    }))
    .addCase(changePasswordAsync.pending, (state) => ({
  ...state,
  loading: true,
  error: null,
}))
.addCase(changePasswordAsync.fulfilled, (state) => ({
  ...state,
  loading: false,
  
}))
.addCase(changePasswordAsync.rejected, (state, action) => ({
  ...state,
  loading: false,
  error: (action.payload as ErrorPayload)?.message || "Password change failed",
}))
 .addCase(changeLandlordPasswordAsync.pending, (state) => ({
  ...state,
  loading: true,
  error: null,
}))
.addCase(changeLandlordPasswordAsync.fulfilled, (state) => ({
  ...state,
  loading: false,
  
}))
.addCase(changeLandlordPasswordAsync.rejected, (state, action) => ({
  ...state,
  loading: false,
  error: (action.payload as ErrorPayload)?.message || "Password change failed",
}))

  },
});

export const { clearProfileState, clearPasswordState } =
  profileSlice.actions;

export default profileSlice.reducer;