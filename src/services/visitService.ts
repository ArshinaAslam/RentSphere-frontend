import { VISIT_ROUTES } from "@/constants/visitRoutes.";
import axiosInstance from "@/services/axios";

import type {
  BookVisitParams,
  BookedSlotsResponse,
  VisitBooking,
} from "../features/visit/types";

interface BookedSlotsApiResponse {
  data: {
    bookedSlots: string[];
  };
}

interface MyVisitsApiResponse {
  data: {
    visits: VisitBooking[];
  };
}

export const visitService = {
  async getBookedSlots(
    propertyId: string,
    date: string,
  ): Promise<BookedSlotsResponse> {
    const res = await axiosInstance.get<BookedSlotsApiResponse>(
      VISIT_ROUTES.BOOKED_SLOTS,
      {
        params: { propertyId, date },
      },
    );
    return res.data.data;
  },

  async bookVisit(params: BookVisitParams): Promise<void> {
    await axiosInstance.post(VISIT_ROUTES.BOOK_VISIT, params);
  },

  async getMyVisits(): Promise<VisitBooking[]> {
    const res = await axiosInstance.get<MyVisitsApiResponse>(
      VISIT_ROUTES.MY_VISITS,
    );
    return res.data.data.visits;
  },

  async cancelVisit(visitId: string): Promise<void> {
    await axiosInstance.patch(VISIT_ROUTES.CANCEL_VISIT(visitId));
  },
};
