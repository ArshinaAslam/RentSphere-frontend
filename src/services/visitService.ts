import axiosInstance from '@/services/axios';

import type { BookVisitParams} from '../features/visit/types';

const VISIT_ROUTES = {
  BOOKED_SLOTS: '/tenant/visits/booked-slots',
  BOOK_VISIT:   '/tenant/visits/book',
  MY_VISITS:    '/tenant/visits/my-visits',
  CANCEL_VISIT: (id: string) => `/tenant/visits/cancel/${id}`,
};

export const visitService = {
  async getBookedSlots(propertyId: string, date: string) {
    const res = await axiosInstance.get(VISIT_ROUTES.BOOKED_SLOTS, {
      params: { propertyId, date },
    });
    return res.data.data ;
  },

  async bookVisit(params: BookVisitParams) {
    await axiosInstance.post(VISIT_ROUTES.BOOK_VISIT, params);
  },


   async getMyVisits() {
    const res = await axiosInstance.get(VISIT_ROUTES.MY_VISITS);
    return res.data.data.visits ;
  },

  async cancelVisit(visitId: string) {
    await axiosInstance.patch(VISIT_ROUTES.CANCEL_VISIT(visitId));
  },
 
};