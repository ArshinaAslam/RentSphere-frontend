import { LANDLORD_VISIT_ROUTES } from '@/constants/visitRoutes.';
import axiosInstance from '@/services/axios';

import type {  VisitStatus } from '../features/landlordVisit/types';



export const landlordVisitService = {
  async getVisits() {
    const res = await axiosInstance.get(LANDLORD_VISIT_ROUTES.GET_VISITS);
    return res.data.data.visits 
  },

  async updateStatus(visitId: string, status: VisitStatus) {
    await axiosInstance.patch(LANDLORD_VISIT_ROUTES.UPDATE_STATUS(visitId), { status });
  },
};