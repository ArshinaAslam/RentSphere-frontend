


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


export type User = Tenant | Landlord;

export interface AdminProperty {
  _id: string;
  title: string;
  type: string;        
  propertyType?: string; 
  status: string;        
  landlordId: string;
  rent: number;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPropertiesResponse {
  properties: AdminProperty[];
  total: number;
  page: number;
  totalPages: number;
}
 
export interface FetchAdminPropertiesParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
}

export interface UsersState {
  tenants: Tenant[];
  landlords: Landlord[];    
   singleLandlord: Landlord | null,   
  tenantTotal: number,     
  landlordTotal: number,   
  currentPage: number;
  totalPages: number;
  search: string;
  activeTab: 'tenants' | 'landlords';  
  isLoading: boolean;
  singleLoading: boolean;           

  error: string | null;


    properties: AdminProperty[];
  propertyTotal: number;
  propertyPage: number;
  propertyTotalPages: number;
  isLoadingProperties: boolean;
}

export interface ErrorPayload {
  success: boolean;
  message: string;
}


export interface FetchParams {
  search?: string;
  page?: number;
  limit?: number;
   role?: 'TENANT' | 'LANDLORD'; 
    from?: string;   
  to?: string; 
}

export interface SingleLandlordResponse {
  success: boolean;
  message: string;
  data: Landlord;  
}



export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    users: T[];
    total: number;
    totalPages: number;
    page: number;
  };
}

export interface ToggleStatusResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ToggleLandlordStatusParams {
  landlordId: string;
  status: 'active' | 'blocked';
}

export interface ToggleTenantStatusParams {
  id: string;
  status: 'active' | 'blocked';
}


export interface KycResponse {
  success: boolean;
  message: string;
  data: { id: string; kycStatus: string; status: string };
}