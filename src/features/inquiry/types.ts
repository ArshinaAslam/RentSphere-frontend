export interface CreateInquiryParams {
  propertyId: string;
  landlordId: string;
  questions:  string[];
  message:    string;
}

export interface TenantInfo {
  _id:       string;
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  avatar:    string;
}

export interface PropertyInquiry {
  _id:       string;
  tenantId:  string | TenantInfo;
  questions: string[];
  message:   string;
  status:    'unread' | 'read';
  createdAt: string;
}





export interface PropertyInfo {
  _id:     string;
  title:   string;
  address: string;
  city:    string;
  images:  string[];
}

export interface LandlordInquiry {
  _id:        string;
  propertyId: string | PropertyInfo;
  tenantId:   string | TenantInfo;
  questions:  string[];
  message:    string;
  status:     'unread' | 'read';
  createdAt:  string;
}

export interface GetLandlordInquiriesResult {
  inquiries: LandlordInquiry[];
  total:     number;
  page:      number;
  limit:     number;
}

export interface GetLandlordInquiriesParams {
  page:   number;
  limit:  number;
  search: string;
}