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
 
}

export interface ErrorPayload {
  success: boolean;
  message: string;
}


export interface FetchPropertyParams {
  id: string;
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
