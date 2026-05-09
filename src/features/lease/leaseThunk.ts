import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { leaseService } from "@/services/leaseService";

import type { CreateLeasePayload, UpdateLeasePayload } from "./types";

export const fetchLandlordLeases = createAsyncThunk(
  "lease/fetchLandlordLeases",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
    }: { page?: number; limit?: number; search?: string } = {},
    { rejectWithValue },
  ) => {
    try {
      const result = await leaseService.getAllLeases(page, limit, search);

      return result.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to fetch leases");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const fetchLeaseById = createAsyncThunk(
  "lease/fetchLeaseById",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.getLeaseById(leaseId);
      return res.data.lease;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to fetch lease");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const createLeaseThunk = createAsyncThunk(
  "lease/create",
  async (data: CreateLeasePayload, { rejectWithValue }) => {
    try {
      const res = await leaseService.createLease(data);
      return res.data.lease;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to create lease");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const updateLeaseThunk = createAsyncThunk(
  "lease/update",
  async (
    { leaseId, data }: { leaseId: string; data: UpdateLeasePayload },
    { rejectWithValue },
  ) => {
    try {
      const res = await leaseService.updateLease(leaseId, data);
      return res.data.lease;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to update lease");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const sendLeaseThunk = createAsyncThunk(
  "lease/send",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.sendLease(leaseId);
      return res.data.lease;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to send lease");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const terminateLeaseThunk = createAsyncThunk(
  "lease/terminate",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.terminateLease(leaseId);
      return res.data.lease;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to terminate lease");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const deleteLeaseThunk = createAsyncThunk(
  "lease/delete",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      await leaseService.deleteLease(leaseId);
      return leaseId;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to delete lease");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const fetchLandlordProperties = createAsyncThunk(
  "lease/fetchLandlordProperties",
  async (_, { rejectWithValue }) => {
    try {
      const res = await leaseService.getProperties();

      return res.data.properties;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to fetch properties");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const searchTenantsThunk = createAsyncThunk(
  "lease/searchTenants",
  async (query: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.searchTenants(query);
      return res;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to search tenants");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const signLeaseAsLandlordThunk = createAsyncThunk(
  "lease/signAsLandlord",
  async (
    { leaseId, signatureName }: { leaseId: string; signatureName: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await leaseService.signLeaseAsLandlord(
        leaseId,
        signatureName,
      );
      return res.data.lease;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to sign lease");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const fetchTenantLeases = createAsyncThunk(
  "lease/fetchTenantLeases",
  async (_, { rejectWithValue }) => {
    try {
      const res = await leaseService.getTenantLeases();

      return res.leases;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to fetch leases");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const fetchTenantLeaseById = createAsyncThunk(
  "lease/fetchTenantLeaseById",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.getTenantLeaseById(leaseId);

      return res.data.lease;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to fetch lease");
      }
      return rejectWithValue("Network error");
    }
  },
);

export const markLeaseAsViewedThunk = createAsyncThunk(
  "lease/markAsViewed",
  async (leaseId: string, { rejectWithValue }) => {
    try {
      const res = await leaseService.markLeaseAsViewed(leaseId);
      return res.data.lease;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed to mark lease as viewed",
        );
      }
      return rejectWithValue("Network error");
    }
  },
);

export const signLeaseThunk = createAsyncThunk(
  "lease/sign",
  async (
    { leaseId, signatureName }: { leaseId: string; signatureName: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await leaseService.signLease(leaseId, signatureName);
      return res.data.lease;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue(data?.message || "Failed to sign lease");
      }
      return rejectWithValue("Network error");
    }
  },
);
