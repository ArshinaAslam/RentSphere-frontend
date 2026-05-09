import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { inquiryService } from "../../services/inquiryService";

import type {
  CreateInquiryParams,
  GetLandlordInquiriesParams,
  GetLandlordInquiriesResult,
  GetTenantInquiriesResult,
} from "./types";

type RejectPayload = { message: string };

export const createInquiry = createAsyncThunk<
  void,
  CreateInquiryParams,
  { rejectValue: RejectPayload }
>("inquiry/create", async (params, { rejectWithValue }) => {
  try {
    await inquiryService.createInquiry(params);
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({
        message: data?.message ?? "Failed to send inquiry",
      });
    }
    return rejectWithValue({ message: "Network error" });
  }
});

export const fetchLandlordInquiries = createAsyncThunk<
  GetLandlordInquiriesResult,
  GetLandlordInquiriesParams,
  { rejectValue: RejectPayload }
>("inquiry/fetchLandlordInquiries", async (params, { rejectWithValue }) => {
  try {
    const res = await inquiryService.getLandlordInquiries(params);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({
        message: data?.message ?? "Failed to fetch inquiries",
      });
    }
    return rejectWithValue({ message: "Network error" });
  }
});

export const markInquiryAsRead = createAsyncThunk<
  string,
  string,
  { rejectValue: RejectPayload }
>("inquiry/markAsRead", async (inquiryId, { rejectWithValue }) => {
  try {
    await inquiryService.markAsRead(inquiryId);
    return inquiryId;
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({ message: data?.message ?? "Failed" });
    }
    return rejectWithValue({ message: "Network error" });
  }
});

export const fetchTenantInquiries = createAsyncThunk<
  GetTenantInquiriesResult,
  { page: number; limit: number; search?: string },
  { rejectValue: RejectPayload }
>("inquiry/fetchTenantInquiries", async (params, { rejectWithValue }) => {
  try {
    const res = await inquiryService.getTenantInquiries(params);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({ message: data?.message ?? "Failed to fetch" });
    }
    return rejectWithValue({ message: "Network error" });
  }
});
