// import { createSlice } from '@reduxjs/toolkit';

// import { createInquiry, fetchPropertyInquiries } from './inquiryThunk';

// import type { PropertyInquiry } from './types';

// interface InquiryState {
//   isSubmitting: boolean;
//   success:      boolean;
//   error:        string | null;
//   propertyInquiries:  PropertyInquiry[];
//   isLoadingInquiries: boolean;
// }

// const initialState: InquiryState = {
//   isSubmitting: false,
//   success:      false,
//   error:        null,
//   propertyInquiries:  [],
//   isLoadingInquiries: false,
// };

// const inquirySlice = createSlice({
//   name: 'inquiry',
//   initialState,
//   reducers: {
//     clearInquiryState: (state) => {
//       state.isSubmitting = false;
//       state.success      = false;
//       state.error        = null;
//     },
//      clearPropertyInquiries: (state) => {   
//     state.propertyInquiries  = [];
//     state.isLoadingInquiries = false;
//   },

//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createInquiry.pending, (state) => {
//         state.isSubmitting = true;
//         state.success      = false;
//         state.error        = null;
//       })
//       .addCase(createInquiry.fulfilled, (state) => {
//         state.isSubmitting = false;
//         state.success      = true;
//       })
//       .addCase(createInquiry.rejected, (state, action) => {
//         state.isSubmitting = false;
//         state.success      = false;
//         state.error        = action.payload?.message ?? 'Failed to send inquiry';
//       })
//        // fetchPropertyInquiries
//     //   .addCase(fetchPropertyInquiries.pending, (state) => {
//     //     state.isLoadingInquiries = true;
//     //     state.error              = null;
//     //   })
//     //   .addCase(fetchPropertyInquiries.fulfilled, (state, action) => {
//     //     state.isLoadingInquiries = false;
//     //     state.propertyInquiries  = action.payload;
//     //   })
//     //   .addCase(fetchPropertyInquiries.rejected, (state, action) => {
//     //     state.isLoadingInquiries = false;
//     //     state.error              = action.payload?.message ?? 'Failed to fetch inquiries';
//     //   });
//   },
// });

// export const { clearInquiryState,clearPropertyInquiries } = inquirySlice.actions;
// export default inquirySlice.reducer;



import { createSlice } from '@reduxjs/toolkit';

import {
  createInquiry,
  
  fetchLandlordInquiries,
} from './inquiryThunk';

import type { PropertyInquiry, LandlordInquiry } from './types';

interface InquiryState {
  // Tenant — create inquiry
  isSubmitting:           boolean;
  success:                boolean;
  error:                  string | null;


  // Landlord — all inquiries page
  landlordInquiries:      LandlordInquiry[];
  landlordInquiriesTotal: number;
  isLoadingLandlord:      boolean;
}

const initialState: InquiryState = {
  isSubmitting:           false,
  success:                false,
  error:                  null,

  propertyInquiries:      [],
  isLoadingInquiries:     false,

  landlordInquiries:      [],
  landlordInquiriesTotal: 0,
  isLoadingLandlord:      false,
};

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {
    clearInquiryState: (state) => {
      state.isSubmitting = false;
      state.success      = false;
      state.error        = null;
    },
    clearPropertyInquiries: (state) => {
      state.propertyInquiries  = [];
      state.isLoadingInquiries = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // createInquiry
      .addCase(createInquiry.pending, (state) => {
        state.isSubmitting = true;
        state.success      = false;
        state.error        = null;
      })
      .addCase(createInquiry.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success      = true;
      })
      .addCase(createInquiry.rejected, (state, action) => {
        state.isSubmitting = false;
        state.success      = false;
        state.error        = action.payload?.message ?? 'Failed to send inquiry';
      })

      

      // fetchLandlordInquiries
      .addCase(fetchLandlordInquiries.pending, (state) => {
        state.isLoadingLandlord = true;
        state.error             = null;
      })
      .addCase(fetchLandlordInquiries.fulfilled, (state, action) => {
        state.isLoadingLandlord      = false;
        state.landlordInquiries      = action.payload.inquiries;
        state.landlordInquiriesTotal = action.payload.total;
      })
      .addCase(fetchLandlordInquiries.rejected, (state, action) => {
        state.isLoadingLandlord = false;
        state.error             = action.payload?.message ?? 'Failed to fetch inquiries';
      });
  },
});

export const { clearInquiryState, clearPropertyInquiries } = inquirySlice.actions;
export default inquirySlice.reducer;