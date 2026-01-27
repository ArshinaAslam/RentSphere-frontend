import { SignupValues } from "@/constants/validation";
import { authService } from "@/services/authService";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError, isAxiosError } from "axios";


export const signupAsync = createAsyncThunk(
    'auth/signup',
    async ({data,role}: { data: SignupValues; role: string },{rejectWithValue})=>{
        try {
        if(role == "TENANT"){
          const result =   await authService.tenantSignup({...data,role})
          return result
        }else if(role === "LANDLORD"){
         const result =  await authService.landlordSignup({ ...data, role });
         return result
        }

      


        } catch (err: unknown) {
           if (isAxiosError(err)) {
     
      return rejectWithValue({ 
        success: false, 
        message: err.response?.data?.message || 'Network error' 
      });
    }
    
    return rejectWithValue({ 
      success: false, 
      message: 'An unexpected error occurred' 
    });
        }

    }
    
)


export const googleAuthAsync = createAsyncThunk(
  'auth/googleAuth',
  async ({ token, role }: { token: string; role: string }, { rejectWithValue }) => {
    try {
      const result = await authService.googleAuth({ token, role });
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ 
          success: false, 
          message: error.response?.data?.message || 'Google auth failed' 
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
)


export const verifyTenantOtpAsync = createAsyncThunk(
    'auth/verifyTenantOtp',
    async (data:{email:string;otp:string},{rejectWithValue})=>{
        try {
            const result = await authService.verifyTenantOtp({...data})
            return result
            
        } catch (error:unknown) {
                if (isAxiosError(error)) {
                  return rejectWithValue({ 
                  success: false, 
                    message: error.response?.data?.message || 'Verification failed' 
                  });
                   }
                return rejectWithValue({ success: false, message: 'Network error' });
        }

    }

)


export const verifyLandlordOtpAsync = createAsyncThunk(
  'auth/verifyLandlordOtp',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const result = await authService.verifyLandlordOtp({ email, otp });
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ 
          success: false, 
          message: error.response?.data?.message || 'Verification failed' 
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);

export const resendOtpAsync = createAsyncThunk(
  'auth/resendOtp',
  async (data:{email:string},{rejectWithValue})=>{
    try {

      const result = await authService.resendOtp(data)
      return result
      
    } catch (error:unknown) {

      if (isAxiosError(error)) {
      return rejectWithValue({ 
        success: false, 
        message: error.response?.data?.message || 'Resend failed' 
      });
    }
    return rejectWithValue({ success: false, message: 'Network error' });
      
    }
  }
)


export const loginTenantAsync = createAsyncThunk(
  'auth/tenantLogin',
  async (data:{email:string;password:string;rememberMe:boolean},{rejectWithValue})=>{
    try {

      const result = await authService.tenatLogin(data)
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      return result
      
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Login failed'
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
)


export const forgotPasswordTenantAsync = createAsyncThunk(
  'auth/tenantForgotPassword',
  async (data:{email:string},{rejectWithValue})=>{
    try {
      const result = await authService.tenantForgotPassword(data)
      return result
      
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Failed to send otp';

        return rejectWithValue({
          success: false,
          message: errorMessage,
        });
      }
      return rejectWithValue({
        success: false,
        message: 'Network error',
      });
    }
  }
)

export const resetTenantPasswordAsync = createAsyncThunk(
  'auth/resetTenantPassword',
  async (data:{email:string;password:string,confirmPassword:string},{rejectWithValue})=>{
     try {
      const result = await authService.resetPasswordTenant(data)
      return result
     } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Password reset failed',
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
)

export const loginLandlordAsync = createAsyncThunk(
  'auth/landlordLogin',
  async (data: { email: string; password: string; rememberMe: boolean }, { rejectWithValue }) => {
    try {
      const result = await authService.landlordLogin(data);  
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Login failed'
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const forgotPasswordLandlordAsync = createAsyncThunk(
  'auth/landlordForgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const result = await authService.landlordForgotPassword(data);
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Failed to send reset link';

        return rejectWithValue({
          success: false,
          message: errorMessage,
        });
      }
      return rejectWithValue({
        success: false,
        message: 'Network error',
      });
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
     try {
      await authService.logout();
     return { success: true };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({ 
          success: false, 
          message: error.response?.data?.message || 'Logout failed' 
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);
