// import { FetchParams } from "@/features/users/usersThunks";
// import axiosInstance from "./axios";
// import { Tenant } from "@/features/users/types";



// // interface FetchTenantsParams {
// //   search?: string;
// //   page?: number;
// //   limit?: number;
// // }

// interface ToggleStatusParams {
//   id: string;
//   status: 'active' | 'blocked';
// }

// export const userService = {
//   // Fetch tenants with search + pagination
//   async getTenantsList(params:FetchParams ) {
//     console.log("reached service for list")
//     const response = await axiosInstance.get('/user/admin/tenantList', {
//       params,
//     });
//     console.log("result for teanntlist from frontservice",response)
//     return response.data;
//   },

//   // Toggle tenant status (block/unblock)
//   async toggleTenantStatus({ id, status }: ToggleStatusParams) {
//     const response = await axiosInstance.patch(`/user/admin/tenants/${id}/status`, { status });
//     console.log("response from service",response.data)
//     return response.data;
//   },

//   // Get single tenant details
//   async getTenant(id: string) {
//     const response = await axiosInstance.get(`/api/admin/tenants/${id}`);
//     return response.data;
//   },
// };



import { FetchParams } from "@/features/users/usersThunks";
import axiosInstance from "./axios";
interface ToggleStatusParams {
  id: string;
  status: 'active' | 'blocked';
}
export const userService = {
  // ✅ EXISTING: Tenants
  async getTenantsList(params: FetchParams) {
    console.log("reached tenant service");
    const response = await axiosInstance.get('/user/admin/tenantList', { params });
    return response.data;
  },

  // ✅ NEW: Landlords  
  async getLandlordsList(params: FetchParams) {
    console.log("reached landlord service");
    const response = await axiosInstance.get('/user/admin/landlordList', { params });
    return response.data;
  },

  // ✅ UNIFIED: Works for both
  async toggleStatus({ id, status }: ToggleStatusParams) {
    const response = await axiosInstance.patch(`/user/admin/users/${id}/status`, { status });
    return response.data;
  },

  async getLandlordById(landlordId: string) {
  console.log("Service: Fetching landlord by ID:", landlordId);
  const response = await axiosInstance.get(`/user/admin/landlordList/${landlordId}`);
  return response.data;
},

 

 
async approveKyc(landlordId: string) {
  console.log("Service: Approving KYC for:", landlordId);
  const response = await axiosInstance.patch(`/user/admin/approve-landlordKyc/${landlordId}`);
  return response.data;
},

  
async rejectKyc(landlordId: string,reason: string) {
  console.log("Service: Rejecting KYC for:", landlordId);
  const response = await axiosInstance.patch(`/user/admin/reject-landlordKyc/${landlordId}`,{reason});
  return response.data;
},

};
