


export const PROPERTY_ROUTES = {

  // Landlord
  LANDLORD_ADD_PROPERTY:         '/landlord/properties/add-property',
  LANDLORD_FETCH_ALL_PROPERTY:   '/landlord/properties/fetch-all-properties',
  LANDLORD_SINGLE_PROPERTY:      (propertyId: string) => `/landlord/properties/single-property/${propertyId}`,
  LANDLORD_DELETE_PROPERTY:      (propertyId: string) => `/landlord/properties/single-property/${propertyId}`,
  LANDLORD_UPDATE_PROPERTY:      (propertyId: string) => `/landlord/properties/edit-property/${propertyId}`,

  // Tenant 
  TENANT_FETCH_ALL_PROPERTY:     '/tenant/properties/fetch-all-properties',
  TENANT_SINGLE_PROPERTY:        (propertyId: string) => `/tenant/properties/single-property/${propertyId}`,

} as const;