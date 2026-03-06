export interface TenantInfo {
  _id:       string;
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  avatar:    string;
}

export interface PropertyInfo {
  _id:     string;
  title:   string;
  address: string;
  city:    string;
  images:  string[];
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

export type VisitStatus = 'confirmed' | 'cancelled' | 'completed';