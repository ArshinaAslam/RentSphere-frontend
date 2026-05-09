export const PROPERTY_ROUTES = {
  // Landlord
  LANDLORD_ADD_PROPERTY: "/landlord/properties/add-property",
  LANDLORD_FETCH_ALL_PROPERTY: "/landlord/properties/fetch-all-properties",
  LANDLORD_SINGLE_PROPERTY: (propertyId: string) =>
    `/landlord/properties/single-property/${propertyId}`,
  LANDLORD_DELETE_PROPERTY: (propertyId: string) =>
    `/landlord/properties/single-property/${propertyId}`,
  LANDLORD_UPDATE_PROPERTY: (propertyId: string) =>
    `/landlord/properties/edit-property/${propertyId}`,
  LANDLORD_PROPERTY_LEASES: (propertyId: string) =>
    `/landlord/properties/${propertyId}/leases`,
  LANDLORD_PROPERTY_PAYMENTS: (propertyId: string) =>
    `/landlord/properties/${propertyId}/payments`,
  TENANT_PROPERTY_PAYMENTS: (propertyId: string) =>
    `/tenant/properties/${propertyId}/payments`,
  LANDLORD_PROPERTY_REVIEWS: (propertyId: string) =>
    `/landlord/properties/${propertyId}/reviews`,

  // Tenant
  TENANT_FETCH_ALL_PROPERTY: "/tenant/properties/fetch-all-properties",
  TENANT_SINGLE_PROPERTY: (propertyId: string) =>
    `/tenant/properties/single-property/${propertyId}`,
} as const;
