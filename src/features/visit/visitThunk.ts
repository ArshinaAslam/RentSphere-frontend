import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { visitService } from '../../services/visitService';

import type { BookVisitParams, VisitBooking } from './types';

export const fetchBookedSlots = createAsyncThunk<
  string[],
  { propertyId: string; date: string },
  { rejectValue: { message: string } }
>(
  'visit/fetchBookedSlots',
  async ({ propertyId, date }, { rejectWithValue }) => {
    try {
      const result = await visitService.getBookedSlots(propertyId, date);
      return result.bookedSlots;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message as string || 'Failed to fetch slots',
        });
      }
      return rejectWithValue({ message: 'Network error' });
    }
  },
);

export const bookVisit = createAsyncThunk<
  void,
  BookVisitParams,
  { rejectValue: { message: string } }
>(
  'visit/bookVisit',
  async (params, { rejectWithValue }) => {
    try {
      await visitService.bookVisit(params);
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message as string || 'Failed to book visit',
        });
      }
      return rejectWithValue({ message: 'Network error' });
    }
  },
);


export const fetchMyVisits = createAsyncThunk<
  VisitBooking[],
  void,
  { rejectValue: { message: string } }
>(
  'visit/fetchMyVisits',
  async (_, { rejectWithValue }) => {
    try {
      const result = await visitService.getMyVisits();
      return result;
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

export const cancelMyVisit = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string } }
>(
  'visit/cancelMyVisit',
  async (visitId, { rejectWithValue }) => {
    try {
      await visitService.cancelVisit(visitId);
      return visitId;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message as string || 'Failed to cancel visit',
        });
      }
      return rejectWithValue({ message: 'Network error' });
    }
  },
);


