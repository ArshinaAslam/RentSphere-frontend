export const PROPERTY_TYPE_ROUTES = {
  GET_ALL: "/admin/property-types/all-property-types",
  ADD: "/admin/property-types/add-property-types",
  TOGGLE: (id: string) => `/admin/property-types/toggle-property-types/${id}`,
  DELETE: (id: string) => `/admin/property-types/delete-property-types/${id}`,
} as const;
