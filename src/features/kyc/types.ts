// // store/kycTypes.ts
// export interface KycState {
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
//   kycData: any | null;
// }

// export interface KycSubmitResponse {
//   success: boolean;
//   message: string;
//   kycId?: string;
//   status?: 'PENDING' | 'APPROVED' | 'REJECTED';
// }


export interface KycState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  kycId: string | null;     
  kycStatus: string | null;  
  kycRejectedReason:string|null;
  kycData: any | null;      
}

export interface KycResult {
  kycId: string;
  kycStatus: string;
}

export interface KycSubmitResponse {
  success: boolean;
  message: string;
  kycId?: string;
  kycStatus?: string;  // ✅ Update this
}

