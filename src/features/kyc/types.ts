// store/kycTypes.ts
export interface KycState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  kycData: any | null;
}

export interface KycSubmitResponse {
  success: boolean;
  message: string;
  kycId?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}
