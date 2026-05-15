import { AUTH_ROUTES } from "@/constants/authRoutes";
import type {
  ForgotPasswordValues,
  LoginValues,
  ResetPasswordValues,
  SignupValues,
} from "@/constants/authValidation";
import type {
  ForgotPasswordResult,
  GoogleAuthResult,
  LoginResult,
  OtpVerifyResult,
  ResetPasswordResult,
  SignupResult,
} from "@/features/auth/types";

import axiosInstance from "./axios";

export const authService = {
  async tenantSignup(
    data: SignupValues & { role: string },
  ): Promise<SignupResult> {
    const response = await axiosInstance.post<{ data: SignupResult }>(
      AUTH_ROUTES.SIGNUP,
      data,
    );
    return response.data.data;
  },

  async googleAuth({
    token,
    role,
  }: {
    token: string;
    role: string;
  }): Promise<GoogleAuthResult> {
    const response = await axiosInstance.post<{ data: GoogleAuthResult }>(
      AUTH_ROUTES.GOOGLE_AUTH,
      { token, role },
    );
    return response.data.data;
  },

  async verifyOtp(data: {
    email: string;
    otp: string;
  }): Promise<OtpVerifyResult> {
    const response = await axiosInstance.post<{ data: OtpVerifyResult }>(
      AUTH_ROUTES.VERIFY_OTP,
      data,
    );
    return response.data.data;
  },

  async resendOtp(data: { email: string; role: string }): Promise<void> {
    await axiosInstance.post(AUTH_ROUTES.RESEND_OTP, data);
  },

  async tenatLogin(data: LoginValues & { role: string }): Promise<LoginResult> {
    const response = await axiosInstance.post<{ data: LoginResult }>(
      AUTH_ROUTES.LOGIN,
      data,
    );
      const { tokens } = response.data.data;
  if (tokens?.accessToken) {
    document.cookie = `accessToken=${tokens.accessToken}; path=/; secure; samesite=strict; max-age=1800`;
  }
  if (tokens?.refreshToken) {
    document.cookie = `refreshToken=${tokens.refreshToken}; path=/; secure; samesite=strict; max-age=604800`;
  }
    
    return response.data.data;
  },

  async landlordLogin(data: {
    email: string;
    password: string;
  }): Promise<LoginResult> {
    const response = await axiosInstance.post<{ data: LoginResult }>(
      AUTH_ROUTES.LANDLORD_LOGIN,
      data,
    );

      const { tokens } = response.data.data;
  if (tokens?.accessToken) {
    document.cookie = `accessToken=${tokens.accessToken}; path=/; secure; samesite=strict; max-age=1800`;
  }
  if (tokens?.refreshToken) {
    document.cookie = `refreshToken=${tokens.refreshToken}; path=/; secure; samesite=strict; max-age=604800`;
  }
    return response.data.data;
  },

  async tenantForgotPassword(
    data: ForgotPasswordValues & { role: string },
  ): Promise<ForgotPasswordResult> {
    const response = await axiosInstance.post<{ data: ForgotPasswordResult }>(
      AUTH_ROUTES.FORGOT_PASSWORD,
      data,
    );
    return response.data.data;
  },

  async landlordForgotPassword(data: {
    email: string;
  }): Promise<ForgotPasswordResult> {
    const response = await axiosInstance.post<{ data: ForgotPasswordResult }>(
      AUTH_ROUTES.LANDLORD_FORGOT_PASSWORD,
      data,
    );
    return response.data.data;
  },

  async resetPassword(
    data: ResetPasswordValues & { role: string },
  ): Promise<ResetPasswordResult> {
    const response = await axiosInstance.post<{ data: ResetPasswordResult }>(
      AUTH_ROUTES.RESET_PASSWORD,
      data,
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post(AUTH_ROUTES.LOGOUT, {}, { withCredentials: true });

     document.cookie = "accessToken=; path=/; secure; samesite=strict; max-age=0";
  document.cookie = "refreshToken=; path=/; secure; samesite=strict; max-age=0";
  },

  async adminLogin(data: {
    email: string;
    password: string;
  }): Promise<LoginResult> {
    const response = await axiosInstance.post<{ data: LoginResult }>(
      AUTH_ROUTES.ADMIN_LOGIN,
      data,
    );

      const { tokens } = response.data.data;
  if (tokens?.accessToken) {
    document.cookie = `accessToken=${tokens.accessToken}; path=/; secure; samesite=strict; max-age=900`;
  }
  if (tokens?.refreshToken) {
    document.cookie = `refreshToken=${tokens.refreshToken}; path=/; secure; samesite=strict; max-age=604800`;
  }
    return response.data.data;
  },
};
