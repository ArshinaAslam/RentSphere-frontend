import { createSlice } from '@reduxjs/toolkit';

import { bookVisit, cancelMyVisit, fetchBookedSlots, fetchMyVisits } from './visitThunk';

import type { VisitBooking } from './types';

interface VisitState {
  bookedSlots:  string[];
  myVisits:       VisitBooking[];
  isLoadingSlots: boolean;
  isLoadingVisits: boolean; 
  isSubmitting:   boolean;
  cancellingId:    string | null; 
  success:        boolean;
  error:          string | null;
}

const initialState: VisitState = {
  bookedSlots:    [],
  myVisits:        [],
  isLoadingSlots: false,
  isLoadingVisits: false,  
  isSubmitting:   false,
  cancellingId:    null,
  success:        false,
  error:          null,
};

const visitSlice = createSlice({
  name: 'visit',
  initialState,
  reducers: {
    clearVisitState: (state) => {
      state.bookedSlots    = [];
      state.isLoadingSlots = false;
      state.isSubmitting   = false;
      state.success        = false;
      state.error          = null;
    },
    clearVisitError: (state) => {
      state.error   = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchBookedSlots
      .addCase(fetchBookedSlots.pending, (state) => {
        state.isLoadingSlots = true;
        state.bookedSlots    = [];
      })
      .addCase(fetchBookedSlots.fulfilled, (state, action) => {
        state.isLoadingSlots = false;
        state.bookedSlots    = action.payload;
      })
      .addCase(fetchBookedSlots.rejected, (state) => {
        state.isLoadingSlots = false;
        state.bookedSlots    = [];
      })

      // bookVisit
      .addCase(bookVisit.pending, (state) => {
        state.isSubmitting = true;
        state.error        = null;
        state.success      = false;
      })
      .addCase(bookVisit.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success      = true;
      })
      .addCase(bookVisit.rejected, (state, action) => {
        state.isSubmitting = false;
        state.success      = false;
        state.error        = action.payload?.message ?? 'Booking failed';
      })
      // fetchMyVisits
.addCase(fetchMyVisits.pending, (state) => {
  state.isLoadingVisits = true;
  state.error           = null;
})
.addCase(fetchMyVisits.fulfilled, (state, action) => {
  state.isLoadingVisits = false;
  state.myVisits        = action.payload;
})
.addCase(fetchMyVisits.rejected, (state, action) => {
  state.isLoadingVisits = false;
  state.error           = action.payload?.message ?? 'Failed to fetch visits';
})

// cancelMyVisit
.addCase(cancelMyVisit.pending, (state, action) => {
  
  state.cancellingId = action.meta.arg;
})
.addCase(cancelMyVisit.fulfilled, (state, action) => {
  state.cancellingId = null;
  const visit = state.myVisits.find(v => v._id === action.payload);
  if (visit) visit.status = 'cancelled';
})
.addCase(cancelMyVisit.rejected, (state, action) => {
  state.cancellingId = null;
  state.error        = action.payload?.message ?? 'Failed to cancel visit';
})
  },
});

export const { clearVisitState, clearVisitError } = visitSlice.actions;
export default visitSlice.reducer;