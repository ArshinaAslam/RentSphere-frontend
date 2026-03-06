//tenant
export const VISIT_ROUTES = {
  BOOKED_SLOTS: '/tenant/visits/booked-slots',
  BOOK_VISIT:   '/tenant/visits/book',
  MY_VISITS:    '/tenant/visits/my-visits',
  CANCEL_VISIT: (id: string) => `/tenant/visits/cancel/${id}`,
};

//landlord
export const LANDLORD_VISIT_ROUTES = {
  GET_VISITS:    '/landlord/visits/visit-requests',
  UPDATE_STATUS: (id: string) => `/landlord/visits/visit-requests/${id}`,
};