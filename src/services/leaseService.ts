import { LEASE_ROUTES } from "@/constants/leaseRoutes";
import type {
  CreateLeasePayload,
  UpdateLeasePayload,
  PaginatedLeasesResponse,
  SingleLeaseResponse,
  PropertiesResponse,
  TenantsResponse,
  LeasesListResponse,
} from "@/features/lease/types";

import axiosInstance from "./axios";

export const leaseService = {
  // ── Landlord ──

  async getAllLeases(page = 1, limit = 10, search = "") {
    const res = await axiosInstance.get<PaginatedLeasesResponse>(
      LEASE_ROUTES.LANDLORD_GET_ALL,
      { params: { page, limit, ...(search && { search }) } },
    );
    return res.data;
  },

  async getLeaseById(leaseId: string) {
    const res = await axiosInstance.get<SingleLeaseResponse>(
      LEASE_ROUTES.LANDLORD_GET_BY_ID(leaseId),
    );
    return res.data;
  },

  async createLease(data: CreateLeasePayload) {
    const res = await axiosInstance.post<SingleLeaseResponse>(
      LEASE_ROUTES.LANDLORD_CREATE,
      data,
    );
    return res.data;
  },

  async updateLease(leaseId: string, data: UpdateLeasePayload) {
    const res = await axiosInstance.put<SingleLeaseResponse>(
      LEASE_ROUTES.LANDLORD_UPDATE(leaseId),
      data,
    );
    return res.data;
  },

  async sendLease(leaseId: string) {
    const res = await axiosInstance.patch<SingleLeaseResponse>(
      LEASE_ROUTES.LANDLORD_SEND(leaseId),
    );
    return res.data;
  },

  async terminateLease(leaseId: string) {
    const res = await axiosInstance.patch<SingleLeaseResponse>(
      LEASE_ROUTES.LANDLORD_TERMINATE(leaseId),
    );
    return res.data;
  },

  async deleteLease(leaseId: string) {
    await axiosInstance.delete(LEASE_ROUTES.LANDLORD_DELETE(leaseId));
  },

  async signLeaseAsLandlord(leaseId: string, signatureName: string) {
    const res = await axiosInstance.patch<SingleLeaseResponse>(
      LEASE_ROUTES.LANDLORD_SIGN(leaseId),
      { signatureName },
    );
    return res.data;
  },

  async getProperties() {
    const res = await axiosInstance.get<PropertiesResponse>(
      LEASE_ROUTES.LANDLORD_PROPERTIES,
    );
    return res.data;
  },

  async searchTenants(query: string) {
    const res = await axiosInstance.get<TenantsResponse>(
      LEASE_ROUTES.SEARCH_TENANTS(query),
    );
    return res.data;
  },

  // ── Tenant ──

  async getTenantLeases() {
    const res = await axiosInstance.get<LeasesListResponse>(
      LEASE_ROUTES.TENANT_GET_ALL,
    );
    return res.data.data;
  },

  async getTenantLeaseById(leaseId: string) {
    const res = await axiosInstance.get<SingleLeaseResponse>(
      LEASE_ROUTES.TENANT_GET_BY_ID(leaseId),
    );
    return res.data;
  },

  async markLeaseAsViewed(leaseId: string) {
    const res = await axiosInstance.patch<SingleLeaseResponse>(
      LEASE_ROUTES.TENANT_MARK_VIEWED(leaseId),
    );
    return res.data;
  },

  async signLease(leaseId: string, signatureName: string) {
    const res = await axiosInstance.patch<SingleLeaseResponse>(
      LEASE_ROUTES.TENANT_SIGN(leaseId),
      { signatureName },
    );
    return res.data;
  },
};
