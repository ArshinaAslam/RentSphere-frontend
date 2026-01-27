// src/services/kycService.ts
import axiosInstance from "./axios";

export const kycService = {
  async submitLandlordKYC(formData: FormData) {
    const response = await axiosInstance.post('/api/landlord/kyc-submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
