import { WISHLIST_ROUTES } from "@/constants/wishlistRoutes";
import type { GetWishlistResponse } from "@/features/wishlist/types";

import axiosInstance from "./axios";

export const wishlistService = {
  async getWishlist(
    tenantId: string,
    page: number = 1,
    limit: number = 6,
  ): Promise<GetWishlistResponse> {
    const response = await axiosInstance.get<{ data: GetWishlistResponse }>(
      WISHLIST_ROUTES.WISHLIST,
      { params: { tenantId, page, limit } },
    );
    return response.data.data;
  },

  async addToWishlist(tenantId: string, propertyId: string): Promise<void> {
    await axiosInstance.post(WISHLIST_ROUTES.ADD, { tenantId, propertyId });
  },

  async removeFromWishlist(
    tenantId: string,
    propertyId: string,
  ): Promise<void> {
    await axiosInstance.delete(WISHLIST_ROUTES.REMOVE, {
      data: { tenantId, propertyId },
    });
  },
};
