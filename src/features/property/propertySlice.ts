import { createSlice } from '@reduxjs/toolkit';

import { deleteLandlordProperty, fetchAllProperties, fetchLandlordProperties, fetchLandlordPropertyById, fetchTenantPropertyById, submitLandlordProperty, updateLandlordProperty } from './propertyThunk';

import type { ErrorPayload, propertyData } from './types';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PropertyState {
  properties: propertyData[];
  selectedProperty: propertyData | null;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  success: boolean;
    total: number;      
  page: number;
  limit: number;
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  isSubmitting: false,
  isLoading: false,
  error: null,
  success: false,
    total: 0,
  page: 1,
  limit: 6,
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setSelectedProperty: (state, action: PayloadAction<propertyData>) => {
      state.selectedProperty = action.payload;
    },
    clearSelectedProperty: (state) => {
      state.selectedProperty = null;
    },
    clearPropertyError: (state) => {
      state.error = null;
      state.success = false;
    },
    clearPropertyState: (state) => {
      state.isSubmitting = false;
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.properties = [];
      state.selectedProperty = null;
    },
    clearProperties: (state) => {
      state.properties = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit property
      .addCase(submitLandlordProperty.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitLandlordProperty.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.success = true;
        const newProperty = action.payload.data.property;
        state.properties.push(newProperty);      
        state.selectedProperty = newProperty;     
      })
      .addCase(submitLandlordProperty.rejected, (state, action) => {
        state.isSubmitting = false;
        state.success = false;
        state.error = action.payload as string || 'Failed to submit property';
      })

      // Fetch all properties
      .addCase(fetchLandlordProperties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLandlordProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.properties = action.payload.properties;
         state.total = action.payload.total;
       state.page = action.payload.page;
          state.limit = action.payload.limit;

      })
      .addCase(fetchLandlordProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as ErrorPayload)?.message || 'Fetching properties failed'; 
      })

      // fetch single property:
.addCase(fetchLandlordPropertyById.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(fetchLandlordPropertyById.fulfilled, (state, action) => {
  state.isLoading = false;
  state.selectedProperty = action.payload
})
.addCase(fetchLandlordPropertyById.rejected, (state, action) => {
  state.isLoading = false;
  state.error = (action.payload as ErrorPayload)?.message || 'Failed to fetch property';
})
.addCase(deleteLandlordProperty.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(deleteLandlordProperty.fulfilled, (state) => {
  state.isLoading = false;
  
  state.selectedProperty = null;
  state.properties = state.properties.filter(p => p._id !== state.selectedProperty?._id);
})
.addCase(deleteLandlordProperty.rejected, (state, action) => {
  state.isLoading = false;
  state.error = (action.payload as ErrorPayload)?.message || 'Failed to delete property';
})

 .addCase(updateLandlordProperty.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateLandlordProperty.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      const updatedProperty = action.payload.data.property;
      
    
      const index = state.properties.findIndex(p => p._id === updatedProperty._id);
      if (index !== -1) {
        state.properties[index] = updatedProperty;
      }
      
      
      state.selectedProperty = updatedProperty;
    })
    .addCase(updateLandlordProperty.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = (action.payload as ErrorPayload)?.message || 'Failed to update property';
    })


    // Fetch all properties (tenant side)
.addCase(fetchAllProperties.pending, (state) => {
  state.isLoading = true;
  state.error = null;
})
.addCase(fetchAllProperties.fulfilled, (state, action) => {
  state.isLoading = false;
  state.properties = action.payload.properties;
  state.total      = action.payload.total;
  state.page       = action.payload.page;
  state.limit      = action.payload.limit;
})
.addCase(fetchAllProperties.rejected, (state, action) => {
  state.isLoading = false;
  state.error = (action.payload as ErrorPayload)?.message || 'Failed to fetch properties';
})


 .addCase(fetchTenantPropertyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedProperty = null;  
      })
      .addCase(fetchTenantPropertyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchTenantPropertyById.rejected, (state, action) => {
        state.isLoading = false;
        state.selectedProperty = null;
        state.error = (action.payload as ErrorPayload)?.message || 'Failed to fetch property';
      })

  },
})




export const {
  setSelectedProperty,
  clearSelectedProperty,
  clearPropertyError,
  clearPropertyState,
  clearProperties,
} = propertySlice.actions;

export default propertySlice.reducer;