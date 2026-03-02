


import { createSlice } from '@reduxjs/toolkit';

import { 
 
  fetchLandlordsAsync,  
     
  fetchSingleLandlordAsync,
  fetchTenantsAsync,
  toggleTenantStatusAsync,
  toggleLandlordStatusAsync,
  approveLandlordKycAsync,
  rejectLandlordKycAsync
} from './adminThunks';
import { ErrorPayload, User } from './types';

import type { UsersState,Tenant, Landlord} from './types';

const initialState: UsersState = {
  tenants: [],
  landlords: [],   
  singleLandlord: null,
  total: 0,
  currentPage: 1,
  totalPages: 0,
  search: '',
  activeTab: 'tenants',  
  isLoading: false,
  singleLoading: false, 
  error: null,
};

const userSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setActiveTab: (state, action) => {  
      state.activeTab = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchTenantsAsync.pending, (state) => ({
        ...state,
        isLoading: true,
        error: null,
      }))
      .addCase(fetchTenantsAsync.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        tenants: action.payload.data.users,  
        total: action.payload.data.total,
        totalPages: action.payload.data.totalPages,
        currentPage: action.payload.data.page,
      }))

   
      .addCase(fetchLandlordsAsync.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        landlords: action.payload.data.users,
        total: action.payload.data.total,
        totalPages: action.payload.data.totalPages,
        currentPage: action.payload.data.page,
      }))

      .addCase(fetchSingleLandlordAsync.pending, (state) => {
  state.singleLoading = true;
  state.error = null;
})
.addCase(fetchSingleLandlordAsync.fulfilled, (state, action) => {
  state.singleLoading = false;
  state.singleLandlord = action.payload.data
})
.addCase(fetchSingleLandlordAsync.rejected, (state, action) => {
  state.singleLoading = false;
  state.error = action.payload?.message || 'Failed to fetch landlord';
})

      
      .addCase(toggleTenantStatusAsync.fulfilled, (state, action) => {
      
        const tenantIndex = state.tenants.findIndex((t) => t.id === action.payload.id);
        if (tenantIndex !== -1) {
          state.tenants[tenantIndex].status = action.payload.status;
        }
       
        
        state.isLoading = false;
      })

        .addCase(toggleLandlordStatusAsync.fulfilled, (state, action) => {
      
        const landlordIndex = state.landlords.findIndex((l) => l.id === action.payload.id);
        if (landlordIndex !== -1) {
          state.landlords[landlordIndex].status = action.payload.status;
        }
        state.isLoading = false;
      })

    



      
.addCase(approveLandlordKycAsync.fulfilled, (state, action) => {
  state.isLoading = false;
  
  
  if (state.singleLandlord && state.singleLandlord.id === action.payload.id) {
    state.singleLandlord.kycStatus = 'APPROVED';
    state.singleLandlord.status = 'active'; 
  }
  
 
  const index = state.landlords.findIndex((l) => l.id === action.payload.id);
  if (index !== -1) {
    state.landlords[index].kycStatus = 'APPROVED';
    state.landlords[index].status = 'active';  
  }
})


.addCase(rejectLandlordKycAsync.fulfilled, (state, action) => {
  state.isLoading = false;
  
  
  if (state.singleLandlord && state.singleLandlord.id === action.payload.id) {
    state.singleLandlord.kycStatus = 'REJECTED';
   
  }
  
  
  const index = state.landlords.findIndex((l) => l.id === action.payload.id);
  if (index !== -1) {
    state.landlords[index].kycStatus = 'REJECTED';
  }
})


  },
});

export const { clearError, setSearch, setCurrentPage, setActiveTab } = userSlice.actions;
export default userSlice.reducer;
