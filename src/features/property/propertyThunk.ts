import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { propertyService } from "@/services/propertyService";

import type {
  FetchAllPropertiesParams,
  FetchPropertiesParams,
  FetchPropertiesResponse,
  FetchPropertyLeasesParams,
  FetchPropertyParams,
  FetchPropertyPaymentsParams,
  FetchPropertyReviewsParams,
  LeasesQueryResult,
  PropertyDetail,
  PropertyPaymentsResult,
  PropertyReviewsResult,
} from "./types";

export const submitLandlordProperty = createAsyncThunk(
  "property/submitLandlordProperty",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const result = await propertyService.submitLandlordProperty(formData);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Property submission failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const fetchLandlordProperties = createAsyncThunk<
  FetchPropertiesResponse,
  FetchPropertiesParams,
  { rejectValue: { success: false; message: string } }
>(
  "property/fetchLandlordProperties",
  async ({ page = 1, limit = 6, search = "" } = {}, { rejectWithValue }) => {
    try {
      const result = await propertyService.getLandlordProperties(
        page,
        limit,
        search,
      );

      return result.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to fetch properties",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const fetchLandlordPropertyById = createAsyncThunk<
  PropertyDetail,
  FetchPropertyParams,
  { rejectValue: { success: false; message: string } }
>(
  "property/fetchLandlordPropertyById",
  async ({ propertyId }, { rejectWithValue }) => {
    try {
      const result = await propertyService.getLandlordPropertyById(propertyId);

      return result.data.data.property;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to fetch property",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const deleteLandlordProperty = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: { success: false; message: string } }
>(
  "property/deleteLandlordProperty",
  async (propertyId, { rejectWithValue }) => {
    try {
      const result = await propertyService.deleteLandlordProperty(propertyId);
      return result.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to delete property",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const updateLandlordProperty = createAsyncThunk(
  "property/updateLandlordProperty",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const result = await propertyService.updateLandlordProperty(id, formData);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Property update failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const fetchAllProperties = createAsyncThunk<
  FetchPropertiesResponse,
  FetchAllPropertiesParams,
  { rejectValue: { success: false; message: string } }
>("property/fetchAllProperties", async (params = {}, { rejectWithValue }) => {
  const {
    page = 1,
    limit = 6,
    search = "",
    bhk = "",
    type = "",
    minPrice,
    maxPrice,
  } = params;
  try {
    const result = await propertyService.getAllProperties({
      page,
      limit,
      search,
      bhk,
      type,
      minPrice,
      maxPrice,
    });

    return result.data.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({
        success: false,
        message: data?.message || "Failed to fetch properties",
      });
    }
    return rejectWithValue({ success: false, message: "Network error" });
  }
});

export const fetchTenantPropertyById = createAsyncThunk<
  PropertyDetail,
  string,
  { rejectValue: { success: false; message: string } }
>(
  "property/fetchTenantPropertyById",
  async (propertyId, { rejectWithValue }) => {
    try {
      const result = await propertyService.getTenantPropertyById(propertyId);
      console.log("Property result:", result.data);
      return result.data.data.property;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to fetch property",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const fetchPropertyLeases = createAsyncThunk<
  LeasesQueryResult,
  FetchPropertyLeasesParams,
  { rejectValue: { success: false; message: string } }
>(
  "property/fetchPropertyLeases",
  async (
    { propertyId, page = 1, limit = 2, status = "" },
    { rejectWithValue },
  ) => {
    try {
      const result = await propertyService.getPropertyLeases(
        propertyId,
        page,
        limit,
        status,
      );

      return result.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to fetch leases",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const fetchPropertyPayments = createAsyncThunk<
  PropertyPaymentsResult,
  FetchPropertyPaymentsParams,
  { rejectValue: { success: false; message: string } }
>(
  "property/fetchPropertyPayments",
  async (
    { propertyId, page = 1, limit = 2, type = "", status = "" },
    { rejectWithValue },
  ) => {
    try {
      const result = await propertyService.getPropertyPayments(
        propertyId,
        page,
        limit,
        type,
        status,
      );

      return result.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to fetch payments",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const fetchTenantPropertyPayments = createAsyncThunk<
  PropertyPaymentsResult,
  FetchPropertyPaymentsParams,
  { rejectValue: { success: false; message: string } }
>(
  "property/fetchTenantPropertyPayments",
  async (
    { propertyId, page = 1, limit = 2, type = "", status = "" },
    { rejectWithValue },
  ) => {
    try {
      const result = await propertyService.getTenantPropertyPayments(
        propertyId,
        page,
        limit,
        type,
        status,
      );
      return result.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to fetch payments",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const fetchPropertyReviews = createAsyncThunk<
  PropertyReviewsResult,
  FetchPropertyReviewsParams,
  { rejectValue: { success: false; message: string } }
>(
  "property/fetchPropertyReviews",
  async ({ propertyId, page, limit }, { rejectWithValue }) => {
    try {
      const result = await propertyService.getPropertyReviews(
        propertyId,
        page,
        limit,
      );
      return result.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to fetch reviews",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);
