import { createSlice } from "@reduxjs/toolkit";

import {
  fetchPropertyTypes,
  addPropertyType,
  togglePropertyType,
  deletePropertyType,
} from "./adminPropertyTypeThunk";

import type { PropertyType } from "../adminPropertyType/types";

interface AdminPropertyTypeState {
  propertyTypes: PropertyType[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminPropertyTypeState = {
  propertyTypes: [],
  total: 0,
  page: 1,
  limit: 1,
  isLoading: false,
  error: null,
};

const adminPropertyTypeSlice = createSlice({
  name: "adminPropertyTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPropertyTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.propertyTypes = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchPropertyTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message ?? "Error";
      })

      .addCase(addPropertyType.fulfilled, (state, action) => {
        state.propertyTypes.unshift(action.payload);
      })
      .addCase(togglePropertyType.fulfilled, (state, action) => {
        const idx = state.propertyTypes.findIndex(
          (t) => t._id === action.payload._id,
        );
        if (idx !== -1) state.propertyTypes[idx] = action.payload;
      })
      .addCase(deletePropertyType.fulfilled, (state, action) => {
        state.propertyTypes = state.propertyTypes.filter(
          (t) => t._id !== action.payload,
        );
      });
  },
});

export default adminPropertyTypeSlice.reducer;
