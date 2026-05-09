export const REVIEW_ROUTES = {
  // Tenant
  SUBMIT_REVIEW: "/tenant/reviews/review-submit",
  MY_REVIEW: (propertyId: string) => `/tenant/reviews/my-review/${propertyId}`,

  FETCH_PROPERTY_REVIEWS: (propertyId: string) =>
    `/review/property/${propertyId}`,
} as const;
