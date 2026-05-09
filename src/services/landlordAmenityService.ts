import { LANDLORD_AMENITY_ROUTES } from "@/constants/amenityRoutes";
import type { ActiveAmenityDto } from "@/features/landlordAmenity/types";

import axiosInstance from "./axios";

export const landlordAmenityService = {
  async getActiveAmenities(): Promise<ActiveAmenityDto[]> {
    const response = await axiosInstance.get<{
      success: boolean;
      message: string;
      data: ActiveAmenityDto[];
    }>(LANDLORD_AMENITY_ROUTES.ACTIVE);

    return response.data.data;
  },
};
