import { createSlice } from "@reduxjs/toolkit";

import { fetchActiveAmenities } from "./landlordAmenityThunk";

import type { ActiveAmenityDto } from "./types";

interface LandlordAmenityState {
  activeAmenities: ActiveAmenityDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: LandlordAmenityState = {
  activeAmenities: [],
  isLoading: false,
  error: null,
};

const landlordAmenitySlice = createSlice({
  name: "landlordAmenities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveAmenities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveAmenities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeAmenities = action.payload;
      })
      .addCase(fetchActiveAmenities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message ?? "Error";
      });
  },
});

export default landlordAmenitySlice.reducer;
