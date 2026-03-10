
import type { PasswordValues } from "@/constants/authValidation";

import axiosInstance from "./axios";


export const landlordService = {
 


async editLandlordProfile(formData: FormData) {  
  const response = await axiosInstance.post('/landlord/profile/editProfile', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data'  
    }
  })
  return response.data;
},




async changeLandlordPassword(data: PasswordValues) {
  const response = await axiosInstance.post('/landlord/profile/change-password', data);
  return response.data;
},



}