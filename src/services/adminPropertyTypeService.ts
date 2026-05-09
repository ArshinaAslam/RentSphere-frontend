import { PROPERTY_TYPE_ROUTES } from "@/constants/propertyTypeRoutes";
import type {
  AddPropertyTypeParams,
  ApiResponse,
  FetchPropertyTypesParams,
  PaginatedPropertyTypesResult,
  PropertyType,
} from "@/features/adminPropertyType/types";

import axiosInstance from "./axios";

import type { AxiosResponse } from "axios";

export const adminPropertyTypeService = {
  getPropertyTypes: (
    params?: FetchPropertyTypesParams,
  ): Promise<AxiosResponse<ApiResponse<PaginatedPropertyTypesResult>>> =>
    axiosInstance.get(PROPERTY_TYPE_ROUTES.GET_ALL, { params }),

  addPropertyType: (
    data: AddPropertyTypeParams,
  ): Promise<AxiosResponse<ApiResponse<PropertyType>>> =>
    axiosInstance.post(PROPERTY_TYPE_ROUTES.ADD, data),

  togglePropertyType: (
    propertyTypeId: string,
  ): Promise<AxiosResponse<ApiResponse<PropertyType>>> =>
    axiosInstance.patch(PROPERTY_TYPE_ROUTES.TOGGLE(propertyTypeId)),

  deletePropertyType: (
    propertyTypeId: string,
  ): Promise<AxiosResponse<ApiResponse<void>>> =>
    axiosInstance.delete(PROPERTY_TYPE_ROUTES.DELETE(propertyTypeId)),
};
