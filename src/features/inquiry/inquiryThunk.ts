import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import { inquiryService } from '../../services/inquiryService';

import type { CreateInquiryParams, PropertyInquiry } from './types';

export const createInquiry = createAsyncThunk<
  void,
  CreateInquiryParams,
  { rejectValue: { message: string } }
>(
  'inquiry/create',
  async (params, { rejectWithValue }) => {
    try {
      await inquiryService.createInquiry(params);
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message as string || 'Failed to send inquiry',
        });
      }
      return rejectWithValue({ message: 'Network error' });
    }
  },
);
//landlord
// export const fetchPropertyInquiries = createAsyncThunk<
//   PropertyInquiry[],
//   string,
//   { rejectValue: { message: string } }
// >(
//   'inquiry/fetchByProperty',
//   async (propertyId, { rejectWithValue }) => {
//     try {
//       return await inquiryService.getPropertyInquiries(propertyId);
//     } catch (error) {
//       if (isAxiosError(error)) {
//         return rejectWithValue({
//           message: error.response?.data?.message as string || 'Failed to fetch inquiries',
//         });
//       }
//       return rejectWithValue({ message: 'Network error' });
//     }
//   },
// );




export const fetchPropertyInquiries = createAsyncThunk<
  PropertyInquiry[],
  string,
  { rejectValue: { message: string } }
>(
  'inquiry/fetchByProperty',
  async (propertyId, { rejectWithValue }) => {
    try {
      return await inquiryService.getPropertyInquiries(propertyId);
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message as string || 'Failed to fetch inquiries',
        });
      }
      return rejectWithValue({ message: 'Network error' });
    }
  },
);

export const fetchLandlordInquiries = createAsyncThunk<
  GetLandlordInquiriesResult,
  GetLandlordInquiriesParams,
  { rejectValue: { message: string } }
>(
  'inquiry/fetchLandlordInquiries',
  async (params, { rejectWithValue }) => {
    try {
      return await inquiryService.getLandlordInquiries(params);
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message as string || 'Failed to fetch inquiries',
        });
      }
      return rejectWithValue({ message: 'Network error' });
    }
  },
);