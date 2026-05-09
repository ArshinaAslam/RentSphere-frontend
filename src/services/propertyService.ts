import { PROPERTY_ROUTES } from "@/constants/propertyRoutes";
import type {
  FetchPropertiesResponse,
  PropertyDetail,
  LeasesQueryResult,
  PropertyPaymentsResult,
  PropertyReviewsResult,
} from "@/features/property/types";

import axiosInstance from "./axios";

import type { AxiosResponse } from "axios";

interface SinglePropertyResponse {
  success: boolean;
  message: string;
  data: {
    property: PropertyDetail;
  };
}

interface PropertyMutationResponse {
  data: {
    property: PropertyDetail;
  };
}

interface LeasesApiResponse {
  data: LeasesQueryResult;
}
interface PaymentsApiResponse {
  data: PropertyPaymentsResult;
}
interface ReviewsApiResponse {
  data: PropertyReviewsResult;
}

interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export const propertyService = {
  async submitLandlordProperty(
    formData: FormData,
  ): Promise<AxiosResponse<PropertyMutationResponse>> {
    return axiosInstance.post(PROPERTY_ROUTES.LANDLORD_ADD_PROPERTY, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async getLandlordProperties(
    page: number,
    limit: number,
    search: string,
  ): Promise<AxiosResponse<ApiSuccessResponse<FetchPropertiesResponse>>> {
    return axiosInstance.get(PROPERTY_ROUTES.LANDLORD_FETCH_ALL_PROPERTY, {
      params: { page, limit, search },
    });
  },

  async getLandlordPropertyById(
    propertyId: string,
  ): Promise<AxiosResponse<SinglePropertyResponse>> {
    return axiosInstance.get(
      PROPERTY_ROUTES.LANDLORD_SINGLE_PROPERTY(propertyId),
    );
  },

  async deleteLandlordProperty(
    propertyId: string,
  ): Promise<AxiosResponse<{ success: boolean; message: string }>> {
    return axiosInstance.delete(
      PROPERTY_ROUTES.LANDLORD_DELETE_PROPERTY(propertyId),
    );
  },

  async updateLandlordProperty(
    propertyId: string,
    formData: FormData,
  ): Promise<AxiosResponse<PropertyMutationResponse>> {
    return axiosInstance.put(
      PROPERTY_ROUTES.LANDLORD_UPDATE_PROPERTY(propertyId),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  async getAllProperties(params: {
    page: number;
    limit: number;
    search: string;
    bhk?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<
    AxiosResponse<{
      success: boolean;
      message: string;
      data: FetchPropertiesResponse;
    }>
  > {
    return axiosInstance.get(PROPERTY_ROUTES.TENANT_FETCH_ALL_PROPERTY, {
      params,
    });
  },

  async getTenantPropertyById(
    propertyId: string,
  ): Promise<AxiosResponse<SinglePropertyResponse>> {
    return axiosInstance.get(
      PROPERTY_ROUTES.TENANT_SINGLE_PROPERTY(propertyId),
    );
  },

  async getPropertyLeases(
    propertyId: string,
    page = 1,
    limit = 2,
    status = "",
  ): Promise<AxiosResponse<LeasesApiResponse>> {
    return axiosInstance.get(
      PROPERTY_ROUTES.LANDLORD_PROPERTY_LEASES(propertyId),
      {
        params: { page, limit, ...(status && { status }) },
      },
    );
  },

  async getPropertyPayments(
    propertyId: string,
    page = 1,
    limit = 2,
    type = "",
    status = "",
  ): Promise<AxiosResponse<PaymentsApiResponse>> {
    return axiosInstance.get(
      PROPERTY_ROUTES.LANDLORD_PROPERTY_PAYMENTS(propertyId),
      {
        params: {
          page,
          limit,
          ...(type && { type }),
          ...(status && { status }),
        },
      },
    );
  },

  async getTenantPropertyPayments(
    propertyId: string,
    page = 1,
    limit = 2,
    type = "",
    status = "",
  ): Promise<AxiosResponse<PaymentsApiResponse>> {
    return axiosInstance.get(
      PROPERTY_ROUTES.TENANT_PROPERTY_PAYMENTS(propertyId),
      {
        params: {
          page,
          limit,
          ...(type && { type }),
          ...(status && { status }),
        },
      },
    );
  },

  async getPropertyReviews(
    propertyId: string,
    page = 1,
    limit = 1,
  ): Promise<AxiosResponse<ReviewsApiResponse>> {
    return axiosInstance.get(
      PROPERTY_ROUTES.LANDLORD_PROPERTY_REVIEWS(propertyId),
      {
        params: { page, limit },
      },
    );
  },
};
