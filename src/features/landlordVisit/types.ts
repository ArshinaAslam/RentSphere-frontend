export interface TenantInfo {
  id:       string;
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  avatar:    string;
}

export interface PropertyInfo {
  id:     string;
  title:   string;
  address: string;
  city:    string;
  images:  string[];
  price:number;
  securityDeposit:number;
  amenities: string[];
}

export interface LandlordVisit {
  _id:        string;
  propertyId: string | PropertyInfo;
  tenantId:   string | TenantInfo;
  landlordId: string;
  date:       string;
  timeSlot:   string;
  status:     'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt:  string;
}


export interface FetchVisitsParams  {
  page?: number;
  limit?: number;
  search?: string;
};

export type VisitStatus = 'confirmed' | 'cancelled' | 'completed';


export interface LandlordVisitsApiResponse {
  data: {
    visits: LandlordVisit[];
    total: number;
    page: number;
    totalPages: number;
  };
}