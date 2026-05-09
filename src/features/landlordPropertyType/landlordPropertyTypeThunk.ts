import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { landlordPropertyTypeService } from "@/services/landlordPropertyTypeService";

import type { PropertyTypeResultDto } from "./types";

type RejectValue = { success: false; message: string };

export const fetchActivePropertyTypes = createAsyncThunk<
  PropertyTypeResultDto[],
  void,
  { rejectValue: RejectValue }
>("landlordPropertyTypes/fetchActive", async (_, { rejectWithValue }) => {
  try {
    const res = await landlordPropertyTypeService.getActivePropertyTypes();

    const responseData = res.data as { data: PropertyTypeResultDto[] };
    return responseData.data;
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
});
