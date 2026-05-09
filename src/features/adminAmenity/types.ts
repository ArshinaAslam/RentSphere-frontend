
export interface Amenity {
  _id: string;
  label: string;
  emoji: string;
  isActive: boolean;
  createdAt?: string;
}

export interface AddAmenityParams {
  label: string;
  emoji: string;
}

export interface FetchAmenitiesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedAmenitiesResult {
  data: Amenity[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}