import { AUTH_ROUTES } from "@/constants/authRoutes";
import type { ForgotPasswordValues, LoginValues, PasswordValues, ResetPasswordValues, SignupValues } from "@/constants/authValidation";


import axiosInstance from "./axios";


export const authService = {
    async tenantSignup(data:SignupValues & {role:string}){
        const response = await  axiosInstance.post(AUTH_ROUTES.SIGNUP,data)
        return response.data
    },

    async landlordSignup(data:SignupValues & {role:string}){
        const response =await  axiosInstance.post(AUTH_ROUTES.LANDLORD_SIGNUP,data)
        return response.data
    },


     async googleAuth({ token, role }: { token: string; role: string }) {
        const response = await axiosInstance.post(AUTH_ROUTES.GOOGLE_AUTH, { token, role });
        console.log("qwerqwer",response.data)
        return response.data;
    },



    async verifyTenantOtp(data:{email:string;otp:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.VERIFY_OTP,data)
        return response.data
    },

      async verifyLandlordOtp(data:{email:string;otp:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.LANDLORD_VERIFY_OTP,data)
        return response.data
    },


    async resendOtp(data:{email:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.RESEND_OTP,data)
        return response.data
    },


    async tenatLogin(data:LoginValues & {role:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.LOGIN,data)
        return response.data
    },

    async tenantForgotPassword(data:ForgotPasswordValues & {role:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.FORGOT_PASSWORD,data)
        return response.data
    },

    async resetPassword(data:ResetPasswordValues & {role:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.RESET_PASSWORD,data)
        return response.data

    },

     async landlordLogin(data:{email:string;password:string; }){
        const response = await axiosInstance.post(AUTH_ROUTES.LANDLORD_LOGIN,data)
        return response.data
    },


     async landlordForgotPassword(data: { email: string }) {
    const response = await axiosInstance.post(AUTH_ROUTES.LANDLORD_FORGOT_PASSWORD, data); 
    return response.data;

     },

    async logout() {
    await axiosInstance.post(AUTH_ROUTES.LOGOUT,{},{withCredentials: true});
  },


  

// async getCurrentUser() {
//   const response = await axiosInstance.get(AUTH_ROUTES.GET_CURRENT_USER);
//   return response.data;
// },


async editTenantProfile(formData: FormData) {  
  const response = await axiosInstance.post('/auth/tenant/editProfile', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data'  
    }
  })
  return response.data;
},


async editLandlordProfile(formData: FormData) {  
  const response = await axiosInstance.post('/auth/landlord/editProfile', formData, {
    headers: { 
      'Content-Type': 'multipart/form-data'  
    }
  })
  return response.data;
},



async changePassword(data: PasswordValues) {
  const response = await axiosInstance.post('/auth/tenant/change-password', data);
  return response.data;
},

async changeLandlordPassword(data: PasswordValues) {
  const response = await axiosInstance.post('/auth/landlord/change-password', data);
  return response.data;
},

async adminLogin(data: { email: string; password: string }) {
  const response = await axiosInstance.post(AUTH_ROUTES.ADMIN_LOGIN, data);
  return response.data;
}

}