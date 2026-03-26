import { PAYMENT_ROUTES } from '@/constants/paymentRoutes';
import axiosInstance from './axios';

export const paymentService = {
  async createDepositOrder(leaseId: string) {
    const response = await axiosInstance.post(PAYMENT_ROUTES.TENANT_DEPOSIT_ORDER, { leaseId });
    return response.data;
  },

  async createRentOrder(leaseId: string, month: number, year: number) {
    const response = await axiosInstance.post(PAYMENT_ROUTES.TENANT_RENT_ORDER, { leaseId, month, year });
    return response.data;
  },

  async verifyPayment(data: {
    razorpayOrderId:   string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentId:         string;
  }) {
    const response = await axiosInstance.post(PAYMENT_ROUTES.TENANT_VERIFY_PAYMENT, data);
    return response.data;
  },

  async getTenantPayments(params: {
    page?:   number;
    limit?:  number;
    search?: string;
    type?:   string;
    status?: string;
  } = {}) {
    const response = await axiosInstance.get(PAYMENT_ROUTES.TENANT_PAYMENT_HISTORY, { params });
    return response.data;
  },

  async getLandlordPayments() {
    const response = await axiosInstance.get(PAYMENT_ROUTES.LANDLORD_PAYMENT_HISTORY);
    return response.data;
  },

  async getPaymentsByProperty(propertyId: string) {
    const response = await axiosInstance.get(PAYMENT_ROUTES.LANDLORD_PAYMENTS_BY_PROPERTY(propertyId));
    return response.data;
  },
};