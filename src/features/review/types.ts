
export interface ReviewData {
  _id: string;
  tenantId: string | { _id: string; firstName: string; lastName: string; profileImage: string };
  propertyId: string;
  leaseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitReviewParams {
  propertyId: string;
  leaseId: string;
  rating: number;
  comment: string;
}

export interface FetchPropertyReviewsParams {
  propertyId: string;
}

export interface ReviewErrorPayload {
  success: boolean;
  message: string;
}

export interface ReviewApiResponse {
  success: boolean;
  message: string;
  data: {
    review: ReviewData;
  };
}

export interface ReviewsApiResponse {
  success: boolean;
  message: string;
  data: {
    reviews: ReviewData[];
  };
}

export interface NullableReviewApiResponse {
  success: boolean;
  message: string;
  data: {
    review: ReviewData | null;
  };
}