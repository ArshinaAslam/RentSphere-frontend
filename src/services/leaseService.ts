import { LEASE_ROUTES } from "@/constants/leaseRoutes";
import type {
  CreateLeasePayload,
  UpdateLeasePayload,
} from "@/features/lease/types";

import axiosInstance    from "./axios";


export const leaseService = {

  // ── Landlord ──
  // async getAllLeases() {
  //   const res = await axiosInstance.get(LEASE_ROUTES.LANDLORD_GET_ALL);
  //   return res.data;
  // },

  async getAllLeases(page = 1, limit = 10, search = "") {
  const res = await axiosInstance.get(LEASE_ROUTES.LANDLORD_GET_ALL, {
    params: { page, limit, ...(search && { search }) },
  });
  return res.data;
},

  async getLeaseById(leaseId: string) {
    const res = await axiosInstance.get(LEASE_ROUTES.LANDLORD_GET_BY_ID(leaseId));
    return res.data;
  },

  async createLease(data: CreateLeasePayload) {  // ← typed
    const res = await axiosInstance.post(LEASE_ROUTES.LANDLORD_CREATE, data);
    return res.data;
  },

  async updateLease(leaseId: string, data: UpdateLeasePayload) {  // ← typed
    const res = await axiosInstance.put(LEASE_ROUTES.LANDLORD_UPDATE(leaseId), data);
    return res.data;
  },

  async sendLease(leaseId: string) {
    const res = await axiosInstance.patch(LEASE_ROUTES.LANDLORD_SEND(leaseId));
    return res.data;
  },

  async terminateLease(leaseId: string) {
    const res = await axiosInstance.patch(LEASE_ROUTES.LANDLORD_TERMINATE(leaseId));
    return res.data;
  },

  async deleteLease(leaseId: string) {
    const res = await axiosInstance.delete(LEASE_ROUTES.LANDLORD_DELETE(leaseId));
    return res.data;
  },

  async signLeaseAsLandlord(leaseId: string, signatureName: string) {
  const res = await axiosInstance.patch(
    LEASE_ROUTES.LANDLORD_SIGN(leaseId),
    { signatureName }
  );
  return res.data;
},

  async getProperties() {
    const res = await axiosInstance.get(LEASE_ROUTES.LANDLORD_PROPERTIES);
    return res.data;
  },

  async searchTenants(query: string) {
    const res = await axiosInstance.get(LEASE_ROUTES.SEARCH_TENANTS(query));
    return res.data;
  },

  // ── Tenant ──
  async getTenantLeases() {
    const res = await axiosInstance.get(LEASE_ROUTES.TENANT_GET_ALL);
    return res.data;
  },

  async getTenantLeaseById(leaseId: string) {
    const res = await axiosInstance.get(LEASE_ROUTES.TENANT_GET_BY_ID(leaseId));
    return res.data;
  },

  async markLeaseAsViewed(leaseId: string) {
    const res = await axiosInstance.patch(LEASE_ROUTES.TENANT_MARK_VIEWED(leaseId));
    return res.data;
  },

  async signLease(leaseId: string, signatureName: string) {
    const res = await axiosInstance.patch(
      LEASE_ROUTES.TENANT_SIGN(leaseId),
      { signatureName }
    );
    return res.data;
  },
};