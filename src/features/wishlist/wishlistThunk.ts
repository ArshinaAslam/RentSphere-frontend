import { createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService }  from "@/services/wishlistService";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (
    { tenantId, page = 1, limit = 6 }: { tenantId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await wishlistService.getWishlist(tenantId, page, limit);
      console.log("res??",res)
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggle",
  async (
    { tenantId, propertyId, isWishlisted }: { tenantId: string; propertyId: string; isWishlisted: boolean },
    { rejectWithValue }
  ) => {
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(tenantId, propertyId);
        return { propertyId, added: false };
      } else {
        await wishlistService.addToWishlist(tenantId, propertyId);
        return { propertyId, added: true };
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update wishlist");
    }
  }
);