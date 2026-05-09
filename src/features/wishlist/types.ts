

export interface WishlistProperty {
  _id:        string;
  title:      string;
  images:     string[];
  price:      number;      
  city:       string;
  address:    string;
  bhk:        string;
  type:       string;
  furnishing: string;
  bedrooms:   number;      
  bathrooms:  number;      
  area:       number;      
  status:     string;
}

export interface WishlistItem {
  _id:        string;
  tenantId:   string;
  property:   WishlistProperty;  
  createdAt:  string;
}

export interface WishlistState {
  items:       WishlistItem[];
  wishlisted:  string[];
  total:       number;
  currentPage: number;
  isLoading:   boolean;
  togglingId:  string | null;
  error:       string | null;
}

export interface GetWishlistResponse {
  items: WishlistItem[];
  total: number;
  page:  number;
  limit: number;
}