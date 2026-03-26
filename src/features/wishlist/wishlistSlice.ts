import { createSlice } from "@reduxjs/toolkit";

import { fetchWishlist, toggleWishlist } from "./wishlistThunk";

import type { WishlistItem, WishlistState } from "./types";

const initialState: WishlistState = {
  items:      [],
  wishlisted: [],
  total:       0,
  currentPage: 1,
  isLoading:  false,
  togglingId: null,
  error:      null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading  = false;
        state.items      = action.payload.items;
          state.total      = action.payload.total;
  state.currentPage = action.payload.page;
//        state.wishlisted = action.payload.items.map((i: WishlistItem) =>
//   typeof i.propertyId === "object" ? i.propertyId._id : i.propertyId
// );

state.wishlisted = action.payload.items.map(
  (i: WishlistItem) => i.property._id   
);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload as string;
      })

      // toggle
      .addCase(toggleWishlist.pending, (state, action) => {
        state.togglingId = action.meta.arg.propertyId;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.togglingId = null;
        const { propertyId, added } = action.payload;
        if (added) {
          state.wishlisted.push(propertyId);
        } else {
          state.wishlisted = state.wishlisted.filter(id => id !== propertyId);
          // state.items      = state.items.filter(i =>
          //   (typeof i.propertyId === "object" ? i.propertyId._id : i.propertyId) !== propertyId
          // );
          state.items = state.items.filter(
  (i) => i.property._id !== propertyId  
);
        }
      })
      .addCase(toggleWishlist.rejected, (state) => {
        state.togglingId = null;
      });
  },
});

export default wishlistSlice.reducer;