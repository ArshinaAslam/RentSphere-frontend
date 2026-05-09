import { PAYMENT_ROUTES } from "@/constants/paymentRoutes";

import axiosInstance from "./axios";

export const paymentService = {
  async createDepositOrder(leaseId: string) {
    const response = await axiosInstance.post(
      PAYMENT_ROUTES.TENANT_DEPOSIT_ORDER,
      { leaseId },
    );
    return response;
  },

  async createRentOrder(leaseId: string, month: number, year: number) {
    const response = await axiosInstance.post(
      PAYMENT_ROUTES.TENANT_RENT_ORDER,
      { leaseId, month, year },
    );
    return response;
  },

  async verifyPayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentId: string;
  }) {
    const response = await axiosInstance.post(
      PAYMENT_ROUTES.TENANT_VERIFY_PAYMENT,
      data,
    );
    return response;
  },

  async getTenantPayments(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
      status?: string;
    } = {},
  ) {
    const response = await axiosInstance.get(
      PAYMENT_ROUTES.TENANT_PAYMENT_HISTORY,
      { params },
    );
    return response;
  },

  async getLandlordPayments(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
      status?: string;
    } = {},
  ) {
    const response = await axiosInstance.get(
      PAYMENT_ROUTES.LANDLORD_PAYMENT_HISTORY,
      { params },
    );
    return response;
  },

  async getPaymentsByProperty(propertyId: string) {
    const response = await axiosInstance.get(
      PAYMENT_ROUTES.LANDLORD_PAYMENTS_BY_PROPERTY(propertyId),
    );
    return response;
  },

  async getPaymentById(paymentId: string) {
    const response = await axiosInstance.get(
      PAYMENT_ROUTES.LANDLORD_PAYMENT_BY_ID(paymentId),
    );
    return response;
  },
};
