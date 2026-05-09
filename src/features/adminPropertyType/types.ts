export interface PropertyType {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
}

export interface PaginatedPropertyTypesResult {
  data: PropertyType[];
  total: number;
  page: number;
  limit: number;
}

export interface AddPropertyTypeParams {
  name: string;
}

export interface FetchPropertyTypesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}