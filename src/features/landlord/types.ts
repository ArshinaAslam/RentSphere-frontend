import type { User, ErrorPayload } from '../auth/types';

export interface LandlordState {
  loading: boolean;
  error: string | null;
}

export type { User, ErrorPayload };

export interface EditProfileResponse {
  success: boolean;
  data: { user: User };
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}