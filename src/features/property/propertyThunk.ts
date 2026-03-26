import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { propertyService } from "@/services/propertyService";

import type { FetchAllPropertiesParams, FetchPropertyParams, propertyData, PropertyDetail } from "./types";


interface FetchPropertiesParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface FetchPropertiesResponse {
  properties: propertyData[];
  total: number;
  page: number;
  limit: number;
}



export const submitLandlordProperty = createAsyncThunk(
  'property/submitLandlordProperty',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const result = await propertyService.submitLandlordProperty(formData);
           return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ 
          success: false, 
          message: error.response?.data?.message || 'Property submission failed' 
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);




export const fetchLandlordProperties = createAsyncThunk<
 FetchPropertiesResponse,
  FetchPropertiesParams,
  { rejectValue: { success: false; message: string } }
>(
  'property/fetchLandlordProperties',
  async ({ page = 1, limit = 6, search = '' } = {}, { rejectWithValue }) => {
    try {
      const result = await propertyService.getLandlordProperties(page, limit, search);
      console.log("result.data is",result.data)
      return result.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ 
          success: false, 
          message: error.response?.data?.message || 'Failed to fetch properties' 
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);




export const fetchLandlordPropertyById = createAsyncThunk<
  PropertyDetail,
  FetchPropertyParams,
  { rejectValue: { success: false; message: string } }
>(
  'property/fetchLandlordPropertyById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const result = await propertyService.getLandlordPropertyById(id);
       console.log("single property result",result)

      return result.data.property
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ 
          success: false, 
          message: error.response?.data?.message || 'Failed to fetch property' 
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const deleteLandlordProperty = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: { success: false; message: string } }
>(
  'property/deleteLandlordProperty',
  async (propertyId, { rejectWithValue }) => {
    try {
      const result = await propertyService.deleteLandlordProperty(propertyId);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ 
          success: false, 
          message: error.response?.data?.message || 'Failed to delete property' 
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);




export const updateLandlordProperty = createAsyncThunk(
  'property/updateLandlordProperty',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const result = await propertyService.updateLandlordProperty(id, formData);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ 
          success: false, 
          message: error.response?.data?.message || 'Property update failed' 
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);





export const fetchAllProperties = createAsyncThunk<
  FetchPropertiesResponse,
  FetchAllPropertiesParams,
  { rejectValue: { success: false; message: string } }
>(
  'property/fetchAllProperties',
  async (params = {}, { rejectWithValue }) => {
    const { page = 1, limit = 3, search = '', bhk = '', type = '', minPrice, maxPrice } = params;
    try {
      const result = await propertyService.getAllProperties({ page, limit, search, bhk, type, minPrice, maxPrice });
      return result.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to fetch properties'
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const fetchTenantPropertyById = createAsyncThunk<
  PropertyDetail,
  string,
  { rejectValue: { success: false; message: string } }
>(
  'property/fetchTenantPropertyById',
  async (id, { rejectWithValue }) => {
    try {
      const result = await propertyService.getTenantPropertyById(id);
      console.log("result.data.property;",result.data.property)
      return result.data.property;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ success: false, message: error.response?.data?.message || 'Failed to fetch property' });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);