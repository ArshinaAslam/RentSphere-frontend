




export interface User {
  id: string;
  email: string;
  role: 'TENANT' | 'LANDLORD'| 'ADMIN';
  fullName: string;
  avatar:string; 
  phone : string; 
  // kycStatus?: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

  aadharNumber?:string;
    panNumber?:string;
   
    aadharFrontUrl?: string;
    aadharBackUrl?: string;
    panFrontUrl?: string;
  
  
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  userData: User | null;    
   tokens: Tokens | null;   
  loading: boolean;
  error: string | null;
}

export interface ErrorPayload {
  success: boolean;
  message: string;
}