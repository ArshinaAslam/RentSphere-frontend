import { INQUIRY_ROUTES } from '@/constants/inquiryRoutes';
import axiosInstance from '@/services/axios';

import type { CreateInquiryParams, GetLandlordInquiriesParams } from '../features/inquiry/types';



export const inquiryService = {
  async createInquiry(params: CreateInquiryParams) {
    await axiosInstance.post(INQUIRY_ROUTES.CREATE_INQUIRY, params);
  },



  async getLandlordInquiries(
    params: GetLandlordInquiriesParams,
  ) {
    const res = await axiosInstance.get(INQUIRY_ROUTES.LANDLORD_INQUIRIES, { params });
    return res.data.data 
  },
};


