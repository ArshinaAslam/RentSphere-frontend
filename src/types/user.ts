export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'TENANT' | 'LANDLORD';  
  isEmailVerified: boolean;
  isActive : boolean
//   isPhoneVerified?: boolean;
//   profileImage?: string;
//   createdAt: string;  // ISO date
//   updatedAt: string;
  
  // Optional tenant/landlord specific fields
//   preferences?: {
//     notifications?: boolean;
//     currency?: string;
//     language?: string;
//   };
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
