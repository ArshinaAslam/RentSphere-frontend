

import type { FetchParams } from "@/features/admin/adminThunks";

import axiosInstance from "./axios";
interface ToggleStatusParams {
  id: string;
  status: 'active' | 'blocked';
}
export const adminService = {

  async getTenantsList(params: FetchParams) {
    console.log("reached tenant service");
    const response = await axiosInstance.get('/admin/tenants/tenantList', { params });
    return response.data;
  },


  async getLandlordsList(params: FetchParams) {
    console.log("reached landlord service");
    const response = await axiosInstance.get('/admin/landlords/landlordList', { params });
    return response.data;
  },

 
  async toggleTenantStatus({ id, status }: ToggleStatusParams) {
    const response = await axiosInstance.patch(`/admin/tenants/${id}/status`, { status });
    return response.data;
  },

  async toggleLandlordStatus({ id, status }: ToggleStatusParams) {
    const response = await axiosInstance.patch(`/admin/landlords/${id}/status`, { status });
    return response.data;
  },

  async getLandlordById(landlordId: string) {
  console.log("Service: Fetching landlord by ID:", landlordId);
  const response = await axiosInstance.get(`/admin/landlords/landlordList/${landlordId}`);
  return response.data;
},

 

 
async approveLandlordKyc(landlordId: string) {
  console.log("Service: Approving KYC for:", landlordId);
  const response = await axiosInstance.patch(`/admin/landlords/approve-landlordKyc/${landlordId}`);
  return response.data;
},

  
async rejectLandlordKyc(landlordId: string,reason: string) {
  console.log("Service: Rejecting KYC for:", landlordId);
  const response = await axiosInstance.patch(`/admin/landlords/reject-landlordKyc/${landlordId}`,{reason});
  return response.data;
},

};
