import { REVIEW_ROUTES } from "@/constants/reviewRoutes";
import type {
  SubmitReviewParams,
  ReviewApiResponse,
  NullableReviewApiResponse,
} from "@/features/review/types";

import axiosInstance from "./axios";

export const reviewService = {
  async submitReview(dto: SubmitReviewParams): Promise<ReviewApiResponse> {
    const response = await axiosInstance.post<ReviewApiResponse>(
      REVIEW_ROUTES.SUBMIT_REVIEW,
      dto,
    );
    return response.data;
  },

  async getMyReview(propertyId: string): Promise<NullableReviewApiResponse> {
    const response = await axiosInstance.get<NullableReviewApiResponse>(
      REVIEW_ROUTES.MY_REVIEW(propertyId),
    );
    return response.data;
  },
};
