// export interface WishlistProperty {
//   _id:        string;
//   title:      string;
//   images:     string[];
//   price:      string;
//   city:       string;
//   address:    string;
//   bhk:        string;
//   type:       string;
//   furnishing: string;
//   bedrooms:   string;
//   bathrooms:  string;
//   area:       string;
//   status:     string;
// }

// export interface WishlistItem {
//   _id:        string;
//   tenantId:   string;
//   propertyId: WishlistProperty;
//   createdAt:  string;
// }



// export interface WishlistState {
//   items:       WishlistItem[];
//   wishlisted:  string[];
//   total:       number;       
//   currentPage: number;       
//   isLoading:   boolean;
//   togglingId:  string | null;
//   error:       string | null;
// }

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