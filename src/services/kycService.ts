import { KYC_ROUTES } from "@/constants/kycRoutes";
import type {
  KycSubmitApiResponse,
  KycStatusApiResponse,
} from "@/features/kyc/types";

import axiosInstance from "./axios";

export const kycService = {
  async submitLandlordKYC(formData: FormData): Promise<KycSubmitApiResponse> {
    const response = await axiosInstance.post<KycSubmitApiResponse>(
      KYC_ROUTES.SUBMIT,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  async fetchKycStatus(email: string): Promise<KycStatusApiResponse> {
    const response = await axiosInstance.get<KycStatusApiResponse>(
      KYC_ROUTES.STATUS,
      {
        params: { email },
      },
    );
    return response.data;
  },
};
