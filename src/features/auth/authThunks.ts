import { EditProfileValues, PasswordValues, SignupValues } from "@/constants/authValidation";
import { authService } from "@/services/authService";
import { EditProfileData } from "@/types/user";
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
      console.log("reached ggooglethunk",result)
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
  async (data:{email:string;password:string;},{rejectWithValue})=>{
    try {

      const result = await authService.tenatLogin(data)
    console.log("frontlogin<<<<....>>>>>>",result)
      return result

//       frontget<<>>> 
// {user: {…}}
// user
// : 
// {id: '698716e22f2c8680385c32cd', email: 'hari@gmail.com', role: 'TENANT', fullName: 'Harii Prasadd', avatar: 'https://rentsphere-user-uploads.s3.ap-southeast-2.…-a4c5-435c-b759-69188a051242-Screenshot (263).png', …}
// [[Prototype]]
// : 
// Object
      
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

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetTenantPassword',
  async (data:{email:string;password:string,confirmPassword:string},{rejectWithValue})=>{
     try {
      const result = await authService.resetPassword(data)
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
  async (data: { email: string; password: string;  }, { rejectWithValue }) => {
    try {
      const result = await authService.landlordLogin(data);  
     console.log("BIG result:",result)
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


export const editTenantProfileAsync = createAsyncThunk(
  'auth/editTenantProfile',
  async (formData: FormData,{rejectWithValue})=>{
    try {
      const result = await  authService.editTenantProfile(formData)
      console.log("result from editeanntprofileasync",result.data.user)
       return result

     
    } catch (error:unknown) {
       if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Profile update failed',
        });
      }
      return rejectWithValue({ 
        success: false, 
        message: 'Network error' 
      });
    
    }
  }
);



export const editLandlordProfileAsync = createAsyncThunk(
  'auth/editLandlordProfile',
  async (formData: FormData,{rejectWithValue})=>{
    try {
      const result = await  authService.editLandlordProfile(formData)
      console.log("result from edit landlord profileasync",result.data.user)
       return result

     
    } catch (error:unknown) {
       if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Profile update failed',
        });
      }
      return rejectWithValue({ 
        success: false, 
        message: 'Network error' 
      });
    
    }
  }
);


export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (data: PasswordValues, { rejectWithValue }) => {
    try {
      const result = await authService.changePassword(data); 
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Password change failed'
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);



export const changeLandlordPasswordAsync = createAsyncThunk(
  'auth/changeLandlordPassword',
  async (data: PasswordValues, { rejectWithValue }) => {
    try {
      const result = await authService.changeLandlordPassword(data); 
      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Password change failed'
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);


export const loginAdminAsync = createAsyncThunk(
  'auth/adminLogin',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authService.adminLogin(data); 
      console.log("result from adminlogin",result)

      return result;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Admin login failed'
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);




export const fetchCurrentUserAsync = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser()
      console.log("very bigdata",response.data)
      return response.data;  
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue({
          success: false,
          message: error.response?.data?.message || 'Failed to fetch user'
        });
      }
      return rejectWithValue({ success: false, message: 'Network error' });
    }
  }
);



