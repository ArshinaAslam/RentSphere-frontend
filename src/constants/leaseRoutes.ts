

export const LEASE_ROUTES = {
  // Landlord
  LANDLORD_GET_ALL:      '/landlord/leases/get-all-leases',
  LANDLORD_GET_BY_ID:    (leaseId: string) => `/landlord/leases/get-lease/${leaseId}`,
  LANDLORD_CREATE:       '/landlord/leases/create-lease',
  LANDLORD_UPDATE:       (leaseId: string) => `/landlord/leases/update-lease/${leaseId}`,
  LANDLORD_SEND:         (leaseId: string) => `/landlord/leases/send-lease/${leaseId}`,
  LANDLORD_TERMINATE:    (leaseId: string) => `/landlord/leases/terminate-lease/${leaseId}`,
  LANDLORD_DELETE:       (leaseId: string) => `/landlord/leases/delete-lease/${leaseId}`,
  LANDLORD_SIGN:          (leaseId: string) => `/landlord/leases/sign/${leaseId}`,
 LANDLORD_PROPERTIES: '/landlord/leases/properties',

  // Tenant
  TENANT_GET_ALL:        '/tenant/leases/my-leases',
  TENANT_GET_BY_ID:      (leaseId: string) => `/tenant/leases/my-lease/${leaseId}`,
  TENANT_MARK_VIEWED:    (leaseId: string) => `/tenant/leases/view/${leaseId}`,
  TENANT_SIGN:           (leaseId: string) => `/tenant/leases/sign/${leaseId}`,

  // Search
  SEARCH_TENANTS:        (q: string) => `/landlord/leases/search-tenant?q=${encodeURIComponent(q)}`,

} as const;