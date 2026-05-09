
import { createSlice } from "@reduxjs/toolkit";

import {
  fetchMyReview,
  submitPropertyReview,
} from "./reviewThunk";

import type { ReviewData, ReviewErrorPayload } from "./types";

interface ReviewState {
  reviews: ReviewData[];
  existingReview: ReviewData | null;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ReviewState = {
  reviews: [],
  existingReview: null,
  isSubmitting: false,
  isLoading: false,
  error: null,
  success: false,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.isSubmitting = false;
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    clearReviews: (state) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit review
      .addCase(submitPropertyReview.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitPropertyReview.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.success = true;
        state.reviews.unshift(action.payload); 
      })
      .addCase(submitPropertyReview.rejected, (state, action) => {
        state.isSubmitting = false;
        state.success = false;
        state.error =
          (action.payload as ReviewErrorPayload)?.message ??
          "Failed to submit review";
      })

      .addCase(fetchMyReview.fulfilled, (state, action) => {
        state.existingReview = action.payload;
        if (action.payload) {
          state.success = true;
        }
      })
      .addCase(fetchMyReview.rejected, (state) => {
        state.existingReview = null;
      })

      // Fetch property reviews
      // .addCase(fetchPropertyReviews.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(fetchPropertyReviews.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.reviews = action.payload;
      // })
      // .addCase(fetchPropertyReviews.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error =
      //     (action.payload as ReviewErrorPayload)?.message ??
      //     "Failed to fetch reviews";
      // });
  },
});

export const { resetReviewState, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
