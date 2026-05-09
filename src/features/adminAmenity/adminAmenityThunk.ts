import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { adminPropertyConfigService } from "@/services/adminAmenityService";

import type {
  Amenity,
  AddAmenityParams,
  FetchAmenitiesParams,
  PaginatedAmenitiesResult,
} from "./types";

type RejectValue = { success: false; message: string };

export const fetchAmenities = createAsyncThunk<
  PaginatedAmenitiesResult,
  FetchAmenitiesParams | undefined,
  { rejectValue: RejectValue }
>("adminAmenity/fetchAmenities", async (params, { rejectWithValue }) => {
  try {
    const res = await adminPropertyConfigService.getAmenities(params);
    return res.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({
        success: false,
        message: data?.message || "Failed to fetch amenities",
      });
    }
    return rejectWithValue({ success: false, message: "Network error" });
  }
});

export const addAmenity = createAsyncThunk<
  Amenity,
  AddAmenityParams,
  { rejectValue: RejectValue }
>("adminAmenity/addAmenity", async (data, { rejectWithValue }) => {
  try {
    const res = await adminPropertyConfigService.addAmenity(data);
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

export const toggleAmenity = createAsyncThunk<
  Amenity,
  string,
  { rejectValue: RejectValue }
>("adminAmenity/toggleAmenity", async (amenityId, { rejectWithValue }) => {
  try {
    const res = await adminPropertyConfigService.toggleAmenity(amenityId);
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
});

export const deleteAmenity = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectValue }
>("adminAmenity/deleteAmenity", async (amenityId, { rejectWithValue }) => {
  try {
    await adminPropertyConfigService.deleteAmenity(amenityId);
    return amenityId;
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
});
