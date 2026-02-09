// export interface Tenant {
//   id: string;
//   tenantId: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   avatar?: string;
 
//   status: 'active' | 'blocked';
//   kycStatus: 'pending' | 'verified' | 'rejected';
//   joinedAt: string;
//   isEmailVerified: boolean;
// }

// export interface UsersState {
//   tenants: Tenant[];
//   total: number;
//   currentPage: number;
//   totalPages: number;
//   search: string;
//   isLoading: boolean;
//   error: string | null;
// }

// export interface ErrorPayload {
//   success: boolean;
//   message: string;
// }


export interface BaseUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'blocked';
  kycStatus: string;
  joinedAt: string;
  isEmailVerified: boolean;
}

export interface Tenant extends BaseUser {
  tenantId: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycDocuments?: {
    aadhaarFront: string;
    aadhaarBack: string;
  };
}

export interface Landlord extends BaseUser {
  landlordId:string;
  kycStatus: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

    aadharNumber:string;
    panNumber:string;
   
    aadharFrontUrl: string;
    aadharBackUrl: string;
    panFrontUrl: string;
    selfie?: string;
  
  kycRejectedReason?: string;
}

// ✅ UNION TYPE for both
export type User = Tenant | Landlord;

export interface UsersState {
  tenants: Tenant[];
  landlords: Landlord[];    
   singleLandlord: Landlord | null,   
  total: number;
  currentPage: number;
  totalPages: number;
  search: string;
  activeTab: 'tenants' | 'landlords';  // ✅ ADD
  isLoading: boolean;
  singleLoading: boolean;           // ✅ NEW: Separate loading for single fetch

  error: string | null;
}

export interface ErrorPayload {
  success: boolean;
  message: string;
}
