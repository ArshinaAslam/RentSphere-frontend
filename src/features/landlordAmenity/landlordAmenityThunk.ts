import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { landlordAmenityService } from "@/services/landlordAmenityService";

import type { ActiveAmenityDto } from "./types";

type RejectValue = { success: false; message: string };

export const fetchActiveAmenities = createAsyncThunk<
  ActiveAmenityDto[],
  void,
  { rejectValue: RejectValue }
>("landlordAmenities/fetchActive", async (_, { rejectWithValue }) => {
  try {
    const res = await landlordAmenityService.getActiveAmenities();
    
    return res;
  } catch (error) {
    if (isAxiosError(error)){
       const data = error.response?.data as { message?: string } | undefined;
      return rejectWithValue({
        success: false,
        message: data?.message || "Failed to fetch",
      });
    }
    return rejectWithValue({ success: false, message: "Network error" });
    
  }
});
