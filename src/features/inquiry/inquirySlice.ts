import { createSlice } from "@reduxjs/toolkit";

import {
  createInquiry,
  fetchLandlordInquiries,
  fetchTenantInquiries,
  markInquiryAsRead,
} from "./inquiryThunk";

import type { LandlordInquiry, TenantInquiry } from "./types";

interface InquiryState {
  // Tenant 
  isSubmitting: boolean;
  success: boolean;
  error: string | null;
  tenantInquiries: TenantInquiry[];
  tenantInquiriesTotal: number;
  tenantInquiriesTotalPages: number;
  isLoadingTenant: boolean;
  propertyInquiries: [];
  isLoadingInquiries: boolean;

  // Landlord 
  landlordInquiries: LandlordInquiry[];
  landlordInquiriesTotal: number;
  isLoadingLandlord: boolean;
}

const initialState: InquiryState = {
  isSubmitting: false,
  success: false,
  error: null,
  tenantInquiriesTotal: 0,
  tenantInquiriesTotalPages: 0,

  propertyInquiries: [],
  isLoadingInquiries: false,
  tenantInquiries: [],
  isLoadingTenant: false,

  landlordInquiries: [],
  landlordInquiriesTotal: 0,
  isLoadingLandlord: false,
};

const inquirySlice = createSlice({
  name: "inquiry",
  initialState,
  reducers: {
    clearInquiryState: (state) => {
      state.isSubmitting = false;
      state.success = false;
      state.error = null;
    },
    clearPropertyInquiries: (state) => {
      state.propertyInquiries = [];
      state.isLoadingInquiries = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // createInquiry
      .addCase(createInquiry.pending, (state) => {
        state.isSubmitting = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createInquiry.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success = true;
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.isSubmitting = false;
        state.success = false;
        state.error = action.payload?.message ?? "Failed to send inquiry";
      })

      .addCase(fetchTenantInquiries.pending, (state) => {
        state.isLoadingTenant = true;
      })

      .addCase(markInquiryAsRead.fulfilled, (state, action) => {
        const inquiry = state.landlordInquiries.find(
          (i) => i._id === action.payload,
        );
        if (inquiry) inquiry.status = "read";
      })
      .addCase(fetchTenantInquiries.fulfilled, (state, action) => {
        state.isLoadingTenant = false;
        state.tenantInquiries = action.payload.inquiries;
        state.tenantInquiriesTotal = action.payload.total;
        state.tenantInquiriesTotalPages = action.payload.totalPages;
      })
      .addCase(fetchTenantInquiries.rejected, (state, action) => {
        state.isLoadingTenant = false;
        state.error = action.payload?.message ?? "Failed to fetch";
      })

      // fetchLandlordInquiries
      .addCase(fetchLandlordInquiries.pending, (state) => {
        state.isLoadingLandlord = true;
        state.error = null;
      })
      .addCase(fetchLandlordInquiries.fulfilled, (state, action) => {
        state.isLoadingLandlord = false;
        state.landlordInquiries = action.payload.inquiries;
        state.landlordInquiriesTotal = action.payload.total;
      })
      .addCase(fetchLandlordInquiries.rejected, (state, action) => {
        state.isLoadingLandlord = false;
        state.error = action.payload?.message ?? "Failed to fetch inquiries";
      });
  },
});

export const { clearInquiryState, clearPropertyInquiries } =
  inquirySlice.actions;
export default inquirySlice.reducer;
