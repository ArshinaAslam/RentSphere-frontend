export interface Landlord {
  id:         string;
  firstName:  string;
  lastName:   string;
  email:      string;
  phone:      string;
  avatar:     string;
}
export interface propertyData {
  _id: string;
  title: string;
  type: string;
  bhk: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  price: number;
  securityDeposit: number;
  vacant: number;
  status: "Available" | "Rented" | "Inactive";
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnishing: "Fully Furnished" | "Semi Furnished" | "Unfurnished";
  description: string;
  amenities: string[];
  images: string[];
  landlordId?: string | Landlord;
  // landlord?:Landlord;
  coordinates?: {
  lat: number;
  lng: number;
};
  createdAt?:string;

}



export interface ErrorPayload {
  success: boolean;
  message: string;
}


export interface FetchPropertyParams {
  propertyId: string;
}



export interface PropertyDetail {
  _id: string;
  title: string;
  type: string;
  bhk: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  price: number;
  securityDeposit: number;     
   status: "Available" | "Rented" | "Inactive";
  bedrooms: number;
  bathrooms: number;
  area: number;
   vacant: number;
 furnishing: "Fully Furnished" | "Semi Furnished" | "Unfurnished";          
  description: string;
  amenities: string[];
  images: string[];
  landlordId: string;
    coordinates?: {
    lat: number;
    lng: number;
  };
 
  createdAt: string;
  updatedAt: string;
}


export interface FetchPropertyResponse {
  property: PropertyDetail;
}


export interface FetchAllPropertiesParams {
  page?: number;
  limit?: number;
  search?: string;
  bhk?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  status ?:string;
}


export interface PropertyLease {
  _id: string;
  leaseId?: string;
  propertyId: string;
  landlordId: string;
  tenantId: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  monthlyRent: number;
  rentAmount?: number;
  startDate: string;
  endDate: string;
  status: string;
  leaseType?: string;
}



export interface PropertyPayment {
  _id: string;
  leaseId: string;
  tenantId: string;
  tenantName: string;       
  landlordId: string; 
  landlordName?: string;       
  propertyId: string;       
  propertyTitle: string;    
  type: string;             
  amount: number;
  platformFee: number;      
  landlordAmount: number;   
  status: string;
  dueDate?: string;
  paidAt?: string;
  razorpayOrderId?: string; 
  month?: number;           
  year?: number;            
  notes?: string;           
  createdAt: string;
}

export interface PropertyReview {
  id: string;
  propertyId: string;
  tenantId: string;
  tenantName:string;
  rating: number;
  comment: string;
  createdAt: string;
}


export interface PropertyPaymentsResult {
  payments: PropertyPayment[];
  total: number;
  page: number;
  limit: number;
}

export interface FetchPropertyPaymentsParams {
  propertyId: string;
  page?: number;
  limit?: number;
   type?: string;
  status?: string;
}

export interface LeasesQueryResult {
  leases: PropertyLease[];
  total: number;
  page: number;
  limit: number;
}

export interface FetchPropertyLeasesParams {
  propertyId: string;
  page?: number;
  limit?: number;
  status?: string;
}


export interface TenantPayment {
  _id: string;
  leaseId: string;
  landlordId: string;
  landlordName: string;      
  propertyId: string;
  propertyTitle: string;
  type: string;
  amount: number;
  platformFee: number;
  landlordAmount: number;
  status: string;
  dueDate?: string;
  paidAt?: string;
  month?: number;
  year?: number;
  notes?: string;
  createdAt: string;
}

export interface TenantPaymentsResult {
  payments: TenantPayment[];
  total: number;
  page: number;
  limit: number;
}

export interface FetchTenantPropertyPaymentsParams {
  propertyId: string;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}


export interface FetchPropertyReviewsParams {
  propertyId: string;
  page: number;
  limit: number;
}


export interface PropertyReviewsResult {
  reviews: PropertyReview[];
  total: number;
  page: number;
  limit: number;
}

export interface FetchPropertiesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FetchPropertiesResponse {
  properties: propertyData[];
  total: number;
  page: number;
  limit: number;
}