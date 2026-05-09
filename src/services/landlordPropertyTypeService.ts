import axiosInstance from "./axios";

export const landlordPropertyTypeService = {
  getActivePropertyTypes: () =>
    axiosInstance.get("/landlord/property-types/active-property-types"),
};
