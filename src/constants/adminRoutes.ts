export const ADMIN_API = {
  TENANT_LIST:          '/admin/tenants/tenantList',
  TENANT_STATUS:        (id: string) => `/admin/tenants/${id}/status`,

  LANDLORD_LIST:        '/admin/landlords/landlordList',
  LANDLORD_BY_ID:       (id: string) => `/admin/landlords/landlordList/${id}`,
  LANDLORD_STATUS:      (id: string) => `/admin/landlords/${id}/status`,
  LANDLORD_APPROVE_KYC: (id: string) => `/admin/landlords/approve-landlordKyc/${id}`,
  LANDLORD_REJECT_KYC:  (id: string) => `/admin/landlords/reject-landlordKyc/${id}`,
};