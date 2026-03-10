

import { PasswordValues } from "@/constants/authValidation";
import axiosInstance from "./axios";


export const tenantService = {
 

async editTenantProfile(formData: FormData) {  
  const response = await axiosInstance.post('/auth/tenant/editProfile', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data'  
    }
  })
  return response.data;
},




async changePassword(data: PasswordValues) {
  const response = await axiosInstance.post('/auth/tenant/change-password', data);
  return response.data;
},




}