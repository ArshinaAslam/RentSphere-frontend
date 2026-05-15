export interface CreateInquiryParams {
  propertyId: string;
  landlordId: string;
  questions: string[];
}

export interface TenantInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface PropertyInquiry {
  _id: string;
  tenantId: string | TenantInfo;
  questions: string[];
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export interface PropertyInfo {
  _id: string;
  title: string;
  address: string;
  city: string;
  images: string[];
  price?: number;
  securityDeposit?: number;
  amenities?: string[] | string;
}

export interface LandlordInquiry {
  _id: string;
  propertyId: string | PropertyInfo;
  tenantId: string | TenantInfo;
  questions: string[];
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export interface GetLandlordInquiriesResult {
  inquiries: LandlordInquiry[];
  total: number;
  page: number;
  limit: number;
}

export interface GetLandlordInquiriesParams {
  page: number;
  limit: number;
  search: string;
}

export interface LandlordInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface TenantInquiry {
  _id: string;
  propertyId: string | PropertyInfo;
  landlordId: string | LandlordInfo;
  questions: string[];
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

export interface GetTenantInquiriesResult {
  inquiries: TenantInquiry[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface GetLandlordInquiriesResult {
  inquiries: LandlordInquiry[];
  total: number;
  page: number;
  limit: number;
}

export interface GetTenantInquiriesResult {
  inquiries: TenantInquiry[];
  total: number;
  page: number;
  totalPages: number;
}
