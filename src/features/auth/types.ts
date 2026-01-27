

// export interface AuthState {
//    userData: {
//     email: string | null;
//     role: string | null;
//   } | null;
//   loading: boolean;
//   error: string | null;
// }


export interface User {
  id: string;
  email: string;
  role: 'TENANT' | 'LANDLORD';
  firstName: string;
  
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  userData: User | null;    // ✅ Fixed syntax
  tokens: Tokens | null;    // ✅ Fixed syntax
  loading: boolean;
  error: string | null;
}

export interface ErrorPayload {
  success: boolean;
  message: string;
}