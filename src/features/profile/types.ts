import type { User } from "@/features/auth/types";
export interface ProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UserProfileResponse {
  success: boolean;
  data: {
    user: User; 
  };
}

export type ErrorPayload = {
  success: boolean;
  message: string;
};