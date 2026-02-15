// import { createSlice } from '@reduxjs/toolkit';
// import { UsersState, ErrorPayload } from './types';
// import { fetchUsersAsync, toggleUserStatusAsync,   } from './usersThunks';

// const initialState: UsersState = {
//   tenants: [],
//   total: 0,
//   currentPage: 1,
//   totalPages: 0,
//   search: '',
//   isLoading: false,
//   error: null,
// };

// const userSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     setSearch: (state, action) => {
//       state.search = action.payload;
//       state.currentPage = 1;
//     },
//     setCurrentPage: (state, action) => {
//       state.currentPage = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Users
//       .addCase(fetchUsersAsync.pending, (state) => ({
//         ...state,
//         isLoading: true,
//         error: null,
//       }))
//       .addCase(fetchUsersAsync.fulfilled, (state, action) => ({
//         ...state,
//         isLoading: false,
//         tenants: action.payload.data.users,
//         total: action.payload.data.total,
//         totalPages: action.payload.data.totalPages,
//         currentPage: action.payload.data.page,
//       }))
//       .addCase(fetchUsersAsync.rejected, (state, action) => ({
//         ...state,
//         isLoading: false,
//         error: (action.payload as ErrorPayload)?.message || 'Failed to fetch users',
//       }))

//       // Toggle Status
//       .addCase(toggleUserStatusAsync.pending, (state) => ({
//         ...state,
//         isLoading: true,
//       }))
//       .addCase(toggleUserStatusAsync.fulfilled, (state, action) => {
//         const index = state.tenants.findIndex((t) => t.id === action.payload.id);
//       if (index !== -1) {
   
//     state.tenants[index].status = action.payload.status;
//   }
  
//         state.isLoading = false;
//       })
//       .addCase(toggleUserStatusAsync.rejected, (state, action) => ({
//         ...state,
//         isLoading: false,
//         error: (action.payload as ErrorPayload)?.message || 'Failed to update status',
//       }));
//   },
// });

// export const { clearError, setSearch, setCurrentPage } = userSlice.actions;
// export default userSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';
import { UsersState, ErrorPayload, User ,Tenant, Landlord} from './types';
import { 
  fetchUsersAsync, 
  toggleUserStatusAsync,
  fetchLandlordsAsync,  
  approveKycAsync,       
  rejectKycAsync,       
  fetchSingleLandlordAsync
} from './usersThunks';

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
  name: 'users',
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
    setActiveTab: (state, action) => {  // ✅ ADD
      state.activeTab = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ TENANTS (existing)
      .addCase(fetchUsersAsync.pending, (state) => ({
        ...state,
        isLoading: true,
        error: null,
      }))
      .addCase(fetchUsersAsync.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        tenants: action.payload.data.users as Tenant[],  
        total: action.payload.data.total,
        totalPages: action.payload.data.totalPages,
        currentPage: action.payload.data.page,
      }))

      // ✅ LANDLORDS (NEW)
      .addCase(fetchLandlordsAsync.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        landlords: action.payload.data.users as Landlord[],
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

      // Toggle Status (works for both)
      .addCase(toggleUserStatusAsync.fulfilled, (state, action) => {
        // Update tenants
        const tenantIndex = state.tenants.findIndex((t) => t.id === action.payload.id);
        if (tenantIndex !== -1) {
          state.tenants[tenantIndex].status = action.payload.status;
        }
        // Update landlords  
        const landlordIndex = state.landlords.findIndex((l) => l.id === action.payload.id);
        if (landlordIndex !== -1) {
          state.landlords[landlordIndex].status = action.payload.status;
        }
        state.isLoading = false;
      })

    



      
.addCase(approveKycAsync.fulfilled, (state, action) => {
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


.addCase(rejectKycAsync.fulfilled, (state, action) => {
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
