export const LANDLORD_AMENITY_ROUTES = {
  ACTIVE: "/landlord/amenity-types/active-amenities",
};

export const ADMIN_AMENITY_ROUTES = {
  GET_ALL: "/admin/amenity-types/amenities",
  ADD: "/admin/amenity-types/add-amenities",
  TOGGLE: (amenityId: string) =>
    `/admin/amenity-types/toggle-amenities/${amenityId}`,
  DELETE: (amenityId: string) =>
    `/admin/amenity-types/delete-amenities/${amenityId}`,
};