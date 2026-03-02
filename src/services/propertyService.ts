import { PROPERTY_ROUTES } from "@/constants/propertyRoutes";

import axiosInstance from "./axios";

export const propertyService = {
  async submitLandlordProperty(formData: FormData) {
    const response = await axiosInstance.post(PROPERTY_ROUTES.LANDLORD_ADD_PROPERTY, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },


  async getLandlordProperties(page: number, limit: number, search: string) {
  const response = await axiosInstance.get(PROPERTY_ROUTES.LANDLORD_FETCH_ALL_PROPERTY, {
    params: { page, limit, search }
  });
  return response.data;
},

 async getLandlordPropertyById(id: string) {
    const response = await axiosInstance.get(PROPERTY_ROUTES.LANDLORD_SINGLE_PROPERTY(id));
    return response.data;
  },

 
  async deleteLandlordProperty(id: string) {
    const response = await axiosInstance.delete(PROPERTY_ROUTES.LANDLORD_DELETE_PROPERTY(id));
    return response.data;
  },


  
async updateLandlordProperty(propertyId: string, formData: FormData) {
  const response = await axiosInstance.put(PROPERTY_ROUTES.LANDLORD_UPDATE_PROPERTY(propertyId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
},





 async getAllProperties(params: {
  page: number;
  limit: number;
  search: string;
  bhk?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const response = await axiosInstance.get(PROPERTY_ROUTES.TENANT_FETCH_ALL_PROPERTY, {
    params
  });
  return response.data;
},







async getTenantPropertyById(propertyId: string) {
  const response = await axiosInstance.get(PROPERTY_ROUTES.TENANT_SINGLE_PROPERTY(propertyId));
  return response.data;
}
};
