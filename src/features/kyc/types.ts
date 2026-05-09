


// export interface KycState {
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
//   kycId: string | null;     
//   kycStatus: string | null;  
//   kycRejectedReason:string|null;
//    kycData: any | null;      
// }



// export interface KycResult {
//   kycId: string;
//   kycStatus: string;
// }

// export interface KycSubmitResponse {
//   success: boolean;
//   message: string;
//   kycId?: string;
//   kycStatus?: string;  
// }

// types.ts

export type KycStatusValue = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";


export interface KycResultData {
  kycId: string;
  kycStatus: KycStatusValue;
  kycRejectedReason: string | null;
}


export interface KycSubmitApiResponse {
  success: boolean;
  message: string;
  data: KycResultData;
}

export interface KycStatusApiResponse {
  success: boolean;
  message: string;
  data: KycResultData;
}


export interface KycState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  kycId: string | null;
  kycStatus: KycStatusValue | null;
  kycRejectedReason: string | null;
  kycData: KycResultData | null;
}


export interface KycRejectPayload {
  success: false;
  message: string;
}