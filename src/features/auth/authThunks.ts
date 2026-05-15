import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import type {
  ForgotPasswordValues,
  LoginValues,
  ResetPasswordValues,
  SignupValues,
} from "@/constants/authValidation";
import { authService } from "@/services/authService";

export const signupAsync = createAsyncThunk(
  "auth/signup",
  async (
    { data, role }: { data: SignupValues; role: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await authService.tenantSignup({ ...data, role });

      return result;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Network error",
        });
      }

      return rejectWithValue({
        success: false,
        message: "An unexpected error occurred",
      });
    }
  },
);

export const googleAuthAsync = createAsyncThunk(
  "auth/googleAuth",
  async (
    { token, role }: { token: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await authService.googleAuth({ token, role });

      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Google auth failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const verifyOtpAsync = createAsyncThunk(
  "auth/verifyOtp",
  async (
    data: { email: string; otp: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await authService.verifyOtp({ ...data });
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Verification failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);



export const resendOtpAsync = createAsyncThunk(
  "auth/resendOtp",
  async (data: { email: string; role: string }, { rejectWithValue }) => {
    try {
      const result = await authService.resendOtp(data);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Resend failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const loginTenantAsync = createAsyncThunk(
  "auth/tenantLogin",
  async (
    { data, role }: { data: LoginValues; role: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await authService.tenatLogin({ ...data, role });

      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Login failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const forgotPasswordTenantAsync = createAsyncThunk(
  "auth/tenantForgotPassword",
  async (
    { data, role }: { data: ForgotPasswordValues; role: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await authService.tenantForgotPassword({ ...data, role });
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message,
        });
      }
      return rejectWithValue({
        success: false,
        message: "Network error",
      });
    }
  },
);

export const resetPasswordAsync = createAsyncThunk(
  "auth/resetTenantPassword",
  async (
    { data, role }: { data: ResetPasswordValues; role: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await authService.resetPassword({ ...data, role });
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Password reset failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const loginLandlordAsync = createAsyncThunk(
  "auth/landlordLogin",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authService.landlordLogin(data);

      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Login failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const forgotPasswordLandlordAsync = createAsyncThunk(
  "auth/landlordForgotPassword",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const result = await authService.landlordForgotPassword(data);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;

        return rejectWithValue({
          success: false,
          message: data?.message,
        });
      }
      return rejectWithValue({
        success: false,
        message: "Network error",
      });
    }
  },
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return { success: true };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;

        return rejectWithValue({
          success: false,
          message: data?.message || "Logout failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);

export const loginAdminAsync = createAsyncThunk(
  "auth/adminLogin",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authService.adminLogin(data);

      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;

        return rejectWithValue({
          success: false,
          message: data?.message || "Admin login failed",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  },
);
