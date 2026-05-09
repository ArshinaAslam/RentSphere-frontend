
import { createSlice } from '@reduxjs/toolkit';

import {
  fetchAmenities, addAmenity, toggleAmenity, deleteAmenity,
} from './adminAmenityThunk';

import type { Amenity } from './types';

interface AdminAmenityState {
  amenities: Amenity[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminAmenityState = {
  amenities: [],
  total: 0,
  page: 1,
  limit: 5,
  isLoading: false,
  error: null,
};

const adminAmenitySlice = createSlice({
  name: 'adminAmenity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAmenities.pending,  (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.isLoading  = false;
        state.amenities  = action.payload.data;
        state.total      = action.payload.total;
        state.page       = action.payload.page;
        state.limit      = action.payload.limit;
      })
      .addCase(fetchAmenities.rejected, (state, action) => { state.isLoading = false; state.error = action.payload?.message ?? 'Error'; })

      .addCase(addAmenity.fulfilled, (state, action) => {
        state.amenities.unshift(action.payload);
      })
      .addCase(toggleAmenity.fulfilled, (state, action) => {
        const idx = state.amenities.findIndex(a => a._id === action.payload._id);
        if (idx !== -1) state.amenities[idx] = action.payload;
      })
      .addCase(deleteAmenity.fulfilled, (state, action) => {
        state.amenities = state.amenities.filter(a => a._id !== action.payload);
      });
  },
});

export default adminAmenitySlice.reducer;