import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { adminPropertyTypeService } from "@/services/adminPropertyTypeService";

import type {
  PropertyType,
  AddPropertyTypeParams,
  PaginatedPropertyTypesResult,
  FetchPropertyTypesParams,
} from "./types";

type RejectValue = { success: false; message: string };

export const fetchPropertyTypes = createAsyncThunk<
  PaginatedPropertyTypesResult,
  FetchPropertyTypesParams | undefined,
  { rejectValue: RejectValue }
>(
  "adminPropertyTypes/fetchPropertyTypes",
  async (params, { rejectWithValue }) => {
    try {
      const res = await adminPropertyTypeService.getPropertyTypes(params);
      return res.data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to fetch",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const addPropertyType = createAsyncThunk<
  PropertyType,
  AddPropertyTypeParams,
  { rejectValue: RejectValue }
>("adminPropertyTypes/addPropertyType", async (data, { rejectWithValue }) => {
  try {
    const res = await adminPropertyTypeService.addPropertyType(data);
    return res.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({
        success: false,
        message: data?.message || "Failed to add",
      });
    }
    return rejectWithValue({ success: false, message: "Network error" });
  }
});

export const togglePropertyType = createAsyncThunk<
  PropertyType,
  string,
  { rejectValue: RejectValue }
>(
  "adminPropertyTypes/togglePropertyType",
  async (propertyId, { rejectWithValue }) => {
    try {
      const res = await adminPropertyTypeService.togglePropertyType(propertyId);
      return res.data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to toggle",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const deletePropertyType = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectValue }
>(
  "adminPropertyTypes/deletePropertyType",
  async (propertyId, { rejectWithValue }) => {
    try {
      await adminPropertyTypeService.deletePropertyType(propertyId);
      return propertyId;
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to delete",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);
