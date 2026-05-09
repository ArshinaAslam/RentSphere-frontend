export const ADMIN_ROUTES = {
  TENANTS: {
    LIST: "/admin/tenants/tenantList",
    TOGGLE_STATUS: (id: string) => `/admin/tenants/${id}/status`,
  },

  LANDLORDS: {
    LIST: "/admin/landlords/landlordList",
    TOGGLE_STATUS: (landlordId: string) =>
      `/admin/landlords/${landlordId}/status`,
    GET_BY_ID: (landlordId: string) =>
      `/admin/landlords/landlordList/${landlordId}`,
    APPROVE_KYC: (landlordId: string) =>
      `/admin/landlords/approve-landlordKyc/${landlordId}`,
    REJECT_KYC: (landlordId: string) =>
      `/admin/landlords/reject-landlordKyc/${landlordId}`,
  },

  PROPERTIES: {
    LIST: "/admin/property/fetch-properties",
  },
};