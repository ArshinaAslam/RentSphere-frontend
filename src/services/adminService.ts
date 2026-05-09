import { ADMIN_ROUTES } from "@/constants/adminRoutes";
import type { FetchParams } from "@/features/admin/adminThunks";
import type {
  FetchAdminPropertiesParams,
  AdminPropertiesResponse,
  Tenant,
  Landlord,
  SingleLandlordResponse,
  PaginatedResponse,
  ToggleTenantStatusParams,
  ToggleStatusResponse,
  ToggleLandlordStatusParams,
  KycResponse,
} from "@/features/admin/types";

import axiosInstance from "./axios";

export const adminService = {
  async getTenantsList(
    params: FetchParams,
  ): Promise<PaginatedResponse<Tenant>> {
    const response = await axiosInstance.get<PaginatedResponse<Tenant>>(
      ADMIN_ROUTES.TENANTS.LIST,
      { params },
    );
    return response.data;
  },

  async getLandlordsList(
    params: FetchParams,
  ): Promise<PaginatedResponse<Landlord>> {
    const response = await axiosInstance.get<PaginatedResponse<Landlord>>(
      ADMIN_ROUTES.LANDLORDS.LIST,
      { params },
    );
    return response.data;
  },

  async toggleTenantStatus({
    id,
    status,
  }: ToggleTenantStatusParams): Promise<ToggleStatusResponse<Tenant>> {
    const response = await axiosInstance.patch<ToggleStatusResponse<Tenant>>(
      ADMIN_ROUTES.TENANTS.TOGGLE_STATUS(id),
      { status },
    );
    return response.data;
  },

  async toggleLandlordStatus({
    landlordId,
    status,
  }: ToggleLandlordStatusParams): Promise<ToggleStatusResponse<Landlord>> {
    const response = await axiosInstance.patch<ToggleStatusResponse<Landlord>>(
      ADMIN_ROUTES.LANDLORDS.TOGGLE_STATUS(landlordId),
      { status },
    );
    return response.data;
  },

  async getLandlordById(landlordId: string): Promise<SingleLandlordResponse> {
    const response = await axiosInstance.get<SingleLandlordResponse>(
      ADMIN_ROUTES.LANDLORDS.GET_BY_ID(landlordId),
    );
    return response.data;
  },

  async approveLandlordKyc(landlordId: string): Promise<KycResponse> {
    const response = await axiosInstance.patch<KycResponse>(
      ADMIN_ROUTES.LANDLORDS.APPROVE_KYC(landlordId),
    );
    return response.data;
  },

  async rejectLandlordKyc(
    landlordId: string,
    reason: string,
  ): Promise<KycResponse> {
    const response = await axiosInstance.patch<KycResponse>(
      ADMIN_ROUTES.LANDLORDS.REJECT_KYC(landlordId),
      { reason },
    );
    return response.data;
  },

  async getPropertiesList(
    params: FetchAdminPropertiesParams,
  ): Promise<AdminPropertiesResponse> {
    const response = await axiosInstance.get<{ data: AdminPropertiesResponse }>(
      ADMIN_ROUTES.PROPERTIES.LIST,
      { params },
    );
    return response.data.data;
  },
};
