// src/services/kycService.ts
import axiosInstance from "./axios";

export const kycService = {
  async submitLandlordKYC(formData: FormData) {
    const response = await axiosInstance.post('/landlord/kyc/kyc-submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async fetchKycStatus (email:string) {
  const response = await axiosInstance.get('/landlord/kyc/kyc-status', {
      params: { email }  
    });
  return response.data;
}
};


