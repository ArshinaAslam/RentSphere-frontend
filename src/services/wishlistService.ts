import { WISHLIST_ROUTES } from "@/constants/wishlistRoutes";

import axiosInstance from "./axios";


export const wishlistService = {
  async getWishlist(tenantId: string,page: number = 1, limit: number = 6) {
    const response = await axiosInstance.get(WISHLIST_ROUTES.WISHLIST, { params: { tenantId,page,limit } });
    return response.data;
  },

  async addToWishlist(tenantId: string, propertyId: string) {
    const response = await axiosInstance.post(WISHLIST_ROUTES.ADD, { tenantId, propertyId });
    return response.data;
  },

  async removeFromWishlist(tenantId: string, propertyId: string) {
    const response = await axiosInstance.delete(WISHLIST_ROUTES.REMOVE, {
      data: { tenantId, propertyId },
    });
    return response.data;
  },
};