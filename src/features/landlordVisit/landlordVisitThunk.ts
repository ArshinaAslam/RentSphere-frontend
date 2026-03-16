import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { landlordVisitService } from '../../services/landlordVisitService';

import type { LandlordVisit, VisitStatus } from './types';

export const fetchLandlordVisits = createAsyncThunk<
  LandlordVisit[],
  void,
  { rejectValue: { message: string } }
>(
  'landlordVisit/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await landlordVisitService.getVisits();
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message as string || 'Failed to fetch visits',
        });
      }
      return rejectWithValue({ message: 'Network error' });
    }
  },
);

export const updateLandlordVisitStatus = createAsyncThunk<
  { visitId: string; status: VisitStatus },
  { visitId: string; status: VisitStatus },
  { rejectValue: { message: string } }
>(
  'landlordVisit/updateStatus',
  async ({ visitId, status }, { rejectWithValue }) => {
    try {
      await landlordVisitService.updateStatus(visitId, status);
      return { visitId, status };
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message as string || 'Failed to update status',
        });
      }
      return rejectWithValue({ message: 'Network error' });
    }
  },
);