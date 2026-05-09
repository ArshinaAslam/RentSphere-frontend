import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { reviewService } from "@/services/reviewService";

import type {
  ReviewData,
  SubmitReviewParams,
  ReviewErrorPayload,
} from "./types";

export const submitPropertyReview = createAsyncThunk<
  ReviewData,
  SubmitReviewParams,
  { rejectValue: ReviewErrorPayload }
>(
  "review/submitPropertyReview",
  async (dto, { rejectWithValue }) => {
    try {
      const result = await reviewService.submitReview(dto);
       
      return result.data.review;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message ?? "Failed to submit review",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const fetchMyReview = createAsyncThunk<
  ReviewData | null,          
  string,                     
  { rejectValue: ReviewErrorPayload }
>(
  "review/fetchMyReview",
  async (propertyId, { rejectWithValue }) => {
    try {
      const result = await reviewService.getMyReview(propertyId);
     
      return result.data.review; 
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message ?? "Failed to fetch review",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

// export const fetchPropertyReviews = createAsyncThunk<
//   ReviewData[],
//   FetchPropertyReviewsParams,
//   { rejectValue: ReviewErrorPayload }
// >(
//   "review/fetchPropertyReviews",
//   async ({ propertyId }, { rejectWithValue }) => {
//     try {
//       const result = await reviewService.getPropertyReviews(propertyId);
//       return result.data.reviews;
//     } catch (error: unknown) {
//       if (isAxiosError(error)) {
//          const data = error.response?.data as { message?: string } | undefined;
//         return rejectWithValue({
//           success: false,
//           message: data?.message ?? "Failed to fetch reviews",
//         });
//       }
//       return rejectWithValue({ success: false, message: "Network error" });
//     }
//   },
// );