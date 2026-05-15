export interface User {
  id: string;
  email: string;
  role: 'TENANT' | 'LANDLORD'| 'ADMIN';
  fullName: string;
  avatar:string; 
  phone : string; 


  aadharNumber?:string;
    panNumber?:string;
   
    aadharFrontUrl?: string;
    aadharBackUrl?: string;
    panFrontUrl?: string;

    kycStatus?: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  
  
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



export interface Tokens {
  accessToken: string;
  refreshToken: string;
}


export interface SignupResult {
  email: string;
  otpSent: boolean;
}


export interface LoginResult {
  user: User;
  tokens: Tokens;
}


export interface OtpVerifyResult {
  kycData: {
    fullName: string;
    email: string;
    phone: string;
  };
  redirectTo: string;
}

export interface ForgotPasswordResult {
  email: string;
}

export interface ResetPasswordResult {
  redirectTo: string;
}

export interface GoogleAuthResult {
  user: User;
  redirectTo: string;
  tokens: Tokens;
}
