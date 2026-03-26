export interface LeaseSignature {
  name:     string;
  signedAt: string;
}

export interface Lease {
  _id:                string;
  propertyId: string | {
    _id:     string;
    title:   string;
    address: string;
    city:    string;
    state:   string;
    images:  string[];
  };
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
}


export interface PropertyResult {
  _id:    string;
  title:  string;
  city:   string;
  state:  string;
  images: string[];
  price:  number;
  status: string;
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

