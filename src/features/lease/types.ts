export interface LeaseSignature {
  name:     string;
  signedAt: string;
}



interface PopulatedProperty {
  _id:         string;
  title:       string;
  address:     string;
  city:        string;
  state:       string;
  images:      string[];
  bedrooms?:   number;  
  bathrooms?:  number;  
  area?:       number; 
  furnishing?: string;  
  amenities?:  string[]; 
}
export interface Lease {
  _id:                string;
  propertyId: PopulatedProperty;
  landlordId: string | {
    _id:       string;
    firstName: string;
    lastName:  string;
    email:     string;
    phone:     string;
    avatar?:   string;
  };
  tenantId: string | {
    _id:       string;
    firstName: string;
    lastName:  string;
    email:     string;
    phone:     string;
    avatar?:   string;
  };

  rentAmount:         number;
  securityDeposit:    number;
  paymentDueDay:      number;
  lateFee:            number;
  startDate:          string;
  endDate:            string;
  leaseType:          'fixed' | 'monthly';
  petsAllowed:        boolean;
  smokingAllowed:     boolean;
  maxOccupants:       number;
  noticePeriod:       number;
  utilitiesIncluded:  string[];
  termsAndConditions: string;
  status:             'draft' | 'sent' | 'viewed' | 'signed' | 'active' | 'expired' | 'terminated';
  tenantSignature?:   LeaseSignature;
  landlordSignature?: LeaseSignature;
  sentAt?:            string;
  viewedAt?:          string;
  signedAt?:          string;
  createdAt:          string;
  updatedAt:          string;
}

export interface LeaseState {
  leases:        Lease[];
  activeLease:   Lease | null;
  isLoading:     boolean;
  isSubmitting:  boolean;
  error:         string | null;
   pagination: { total: number; page: number; totalPages: number };
    preFill: {
    tenantId: string;
    propertyId: string;
    rentAmount: string;
    securityDeposit: string;
    tenantName: string;
    tenantEmail?: string;
    tenantPhone?: string;
    tenantAvatar?: string;
    propertyTitle: string;
     amenities?:       string[];
  } | null;
}


export interface PropertyResult {
  _id:    string;
  title:  string;
  city:   string;
  state:  string;
  images: string[];
  price:  number;
  status: string;
    securityDeposit?: number;  
  amenities?:       string[]; 

}
export interface TenantSearchResult {
  _id:       string;
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  avatar?:   string;
}

export interface CreateLeasePayload {
  propertyId:          string;
  tenantId:            string;
  rentAmount:          number;
  securityDeposit:     number;
  paymentDueDay:       number;
  lateFee:             number;
  startDate:           string;
  endDate:             string;
  leaseType:           'fixed' | 'monthly';
  petsAllowed:         boolean;
  smokingAllowed:      boolean;
  maxOccupants:        number;
  noticePeriod:        number;
  utilitiesIncluded:   string[];
  termsAndConditions:  string;
}

export interface UpdateLeasePayload {
  rentAmount?:         number;
  securityDeposit?:    number;
  paymentDueDay?:      number;
  lateFee?:            number;
  startDate?:          string;
  endDate?:            string;
  leaseType?:          'fixed' | 'monthly';
  petsAllowed?:        boolean;
  smokingAllowed?:     boolean;
  maxOccupants?:       number;
  noticePeriod?:       number;
  utilitiesIncluded?:  string[];
  termsAndConditions?: string;
}

export interface PaginatedLeasesResponse {
  success: boolean;
  message: string;
  data: {
    leases: Lease[];
    total: number;
    page: number;
    totalPages: number;
  };
}
export interface SingleLeaseResponse {
  success: boolean;
  message: string;
  data: {
    lease: Lease;
  };
}

export interface LeasesListResponse {
  data: {
    leases: Lease[];
  };
}

export interface PropertiesResponse {
  success: boolean;
  message: string;
  data: {
    properties: PropertyResult[];
  };
}

export interface TenantsResponse {
  tenants: TenantSearchResult[];
}