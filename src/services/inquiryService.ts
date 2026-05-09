import { INQUIRY_ROUTES } from "@/constants/inquiryRoutes";
import axiosInstance from "@/services/axios";

import type {
  ApiResponse,
  CreateInquiryParams,
  GetLandlordInquiriesParams,
  GetLandlordInquiriesResult,
  GetTenantInquiriesResult,
} from "../features/inquiry/types";

export const inquiryService = {
  async createInquiry(params: CreateInquiryParams): Promise<void> {
    await axiosInstance.post<ApiResponse<null>>(
      INQUIRY_ROUTES.CREATE_INQUIRY,
      params,
    );
  },

  async getTenantInquiries(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<ApiResponse<GetTenantInquiriesResult>> {
    const res = await axiosInstance.get<ApiResponse<GetTenantInquiriesResult>>(
      INQUIRY_ROUTES.TENANT_INQUIRIES,
      { params },
    );
    return res.data;
  },

  async getLandlordInquiries(
    params: GetLandlordInquiriesParams,
  ): Promise<ApiResponse<GetLandlordInquiriesResult>> {
    const res = await axiosInstance.get<
      ApiResponse<GetLandlordInquiriesResult>
    >(INQUIRY_ROUTES.LANDLORD_INQUIRIES, { params });
    return res.data;
  },

  async markAsRead(inquiryId: string): Promise<void> {
    await axiosInstance.patch<ApiResponse<null>>(
      INQUIRY_ROUTES.MARK_AS_READ(inquiryId),
    );
  },
};
