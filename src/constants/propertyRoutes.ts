


export const PROPERTY_ROUTES = {

  // Landlord
  LANDLORD_ADD_PROPERTY:         '/landlord/properties/add-property',
  LANDLORD_FETCH_ALL_PROPERTY:   '/landlord/properties/fetch-all-properties',
  LANDLORD_SINGLE_PROPERTY:      (id: string) => `/landlord/properties/single-property/${id}`,
  LANDLORD_DELETE_PROPERTY:      (id: string) => `/landlord/properties/single-property/${id}`,
  LANDLORD_UPDATE_PROPERTY:      (id: string) => `/landlord/properties/edit-property/${id}`,

  // Tenant (public)
  TENANT_FETCH_ALL_PROPERTY:     '/tenant/properties/fetch-all-properties',
  TENANT_SINGLE_PROPERTY:        (id: string) => `/tenant/properties/single-property/${id}`,

} as const;