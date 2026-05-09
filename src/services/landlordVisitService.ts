import { LANDLORD_VISIT_ROUTES } from "@/constants/visitRoutes.";
import axiosInstance from "@/services/axios";

import type {
  LandlordVisitsApiResponse,
  VisitStatus,
} from "../features/landlordVisit/types";

export const landlordVisitService = {
  async getVisits({
    page,
    limit,
    search,
  }: {
    page: number;
    limit: number;
    search: string;
  }) {
    const res = await axiosInstance.get<LandlordVisitsApiResponse>(
      LANDLORD_VISIT_ROUTES.GET_VISITS,
      { params: { page, limit, search } },
    );
    return res;
  },

  async updateStatus(visitId: string, status: VisitStatus): Promise<void> {
    await axiosInstance.patch(LANDLORD_VISIT_ROUTES.UPDATE_STATUS(visitId), {
      status,
    });
  },
};
