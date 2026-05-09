import { ADMIN_AMENITY_ROUTES } from "@/constants/amenityRoutes";
import type {
  AddAmenityParams,
  FetchAmenitiesParams,
  Amenity,
  PaginatedAmenitiesResult,
  ApiResponse,
} from "@/features/adminAmenity/types";

import axiosInstance from "./axios";

export const adminPropertyConfigService = {
  getAmenities: (params?: FetchAmenitiesParams) =>
    axiosInstance.get<ApiResponse<PaginatedAmenitiesResult>>(
      ADMIN_AMENITY_ROUTES.GET_ALL,
      { params },
    ),

  addAmenity: (data: AddAmenityParams) =>
    axiosInstance.post<ApiResponse<Amenity>>(ADMIN_AMENITY_ROUTES.ADD, data),

  toggleAmenity: (amenityId: string) =>
    axiosInstance.patch<ApiResponse<Amenity>>(
      ADMIN_AMENITY_ROUTES.TOGGLE(amenityId),
    ),

  deleteAmenity: (amenityId: string) =>
    axiosInstance.delete<ApiResponse<null>>(
      ADMIN_AMENITY_ROUTES.DELETE(amenityId),
    ),
};
