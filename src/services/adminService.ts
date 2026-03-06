

import type { FetchParams } from "@/features/admin/adminThunks";

import axiosInstance from "./axios";
interface ToggleStatusParams {
  id: string;
  status: 'active' | 'blocked';
}
export const adminService = {

  async getTenantsList(params: FetchParams) {
   
    const response = await axiosInstance.get('/admin/tenants/tenantList', { params });
    return response.data;
  },


  async getLandlordsList(params: FetchParams) {
    
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
 
  const response = await axiosInstance.get(`/admin/landlords/landlordList/${landlordId}`);
  return response.data;
},

 

 
async approveLandlordKyc(landlordId: string) {
 
  const response = await axiosInstance.patch(`/admin/landlords/approve-landlordKyc/${landlordId}`);
  return response.data;
},

  
async rejectLandlordKyc(landlordId: string,reason: string) {
 
  const response = await axiosInstance.patch(`/admin/landlords/reject-landlordKyc/${landlordId}`,{reason});
  return response.data;
},

};
