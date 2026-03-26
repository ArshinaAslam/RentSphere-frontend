import { createSlice } from '@reduxjs/toolkit';

import { fetchLandlordVisits, updateLandlordVisitStatus } from './landlordVisitThunk';

import type { LandlordVisit } from './types';

interface LandlordVisitState {
  visits:     LandlordVisit[];
   total:      number;        
  page:       number;       
  totalPages: number;  
  isLoading:  boolean;
  updatingId: string | null;
  error:      string | null;
}

const initialState: LandlordVisitState = {
  visits:     [],
  total:      0,       
  page:       1,        
  totalPages: 1, 
  isLoading:  false,
  updatingId: null,
  error:      null,
};

const landlordVisitSlice = createSlice({
  name: 'landlordVisit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchLandlordVisits
      .addCase(fetchLandlordVisits.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchLandlordVisits.fulfilled, (state, action) => {
        state.isLoading = false;
         state.visits     = action.payload.visits;      
  state.total      = action.payload.total;      
  state.page       = action.payload.page;       
  state.totalPages = action.payload.totalPages; 
      })
      .addCase(fetchLandlordVisits.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload?.message ?? 'Failed to fetch visits';
      })

      // updateLandlordVisitStatus
      .addCase(updateLandlordVisitStatus.pending, (state, action) => {
        state.updatingId = action.meta.arg.visitId;
        state.error      = null;
      })
      .addCase(updateLandlordVisitStatus.fulfilled, (state, action) => {
        state.updatingId = null;
        const { visitId, status } = action.payload;
        const visit = state.visits.find(v => v._id === visitId);
        if (visit) visit.status = status;
      })
      .addCase(updateLandlordVisitStatus.rejected, (state, action) => {
        state.updatingId = null;
        state.error      = action.payload?.message ?? 'Failed to update status';
      });
  },
});

export default landlordVisitSlice.reducer;