import { createSlice } from "@reduxjs/toolkit";

import { fetchActivePropertyTypes } from "./landlordPropertyTypeThunk";

import type { PropertyTypeResultDto } from "./types";

interface LandlordPropertyTypeState {
  activeTypes: PropertyTypeResultDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LandlordPropertyTypeState = {
  activeTypes: [],
  isLoading: false,
  error: null,
};

const landlordPropertyTypeSlice = createSlice({
  name: "landlordPropertyTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivePropertyTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActivePropertyTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeTypes = action.payload;
      })
      .addCase(fetchActivePropertyTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message ?? "Error";
      });
  },
});

export default landlordPropertyTypeSlice.reducer;
