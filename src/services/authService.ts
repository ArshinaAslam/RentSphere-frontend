import { SignupValues } from "@/constants/validation";
import axiosInstance from "./axios";

export const authService = {
    async tenantSignup(data:SignupValues & {role:string}){
        const response = await  axiosInstance.post('/auth/tenant/signup',data)
        return response.data
    },

    async landlordSignup(data:SignupValues & {role:string}){
        const response =await  axiosInstance.post('/auth/landlord/signup',data)
        return response.data
    },


     async googleAuth({ token, role }: { token: string; role: string }) {
        const response = await axiosInstance.post('/auth/google-auth', { token, role });
        return response.data;
    },



    async verifyTenantOtp(data:{email:string;otp:string}){
        const response = await axiosInstance.post('/auth/tenant/verify-otp',data)
        return response.data
    },

      async verifyLandlordOtp(data:{email:string;otp:string}){
        const response = await axiosInstance.post('/auth/landlord/verify-otp',data)
        return response.data
    },


    async resendOtp(data:{email:string}){
        const response = await axiosInstance.post('/auth/tenant/resend-otp',data)
        return response.data
    },


    async tenatLogin(data:{email:string;password:string; rememberMe: boolean}){
        const response = await axiosInstance.post('/auth/tenant/login',data)
        return response.data
    },

    async tenantForgotPassword(data:{email:string}){
        const response = await axiosInstance.post('/auth/tenant/forgot-password',data)
        return response.data
    },

    async resetPasswordTenant(data:{password:string,confirmPassword:string}){
        const response = await axiosInstance.post('/auth/tenant/reset-password',data)
        return response.data

    },

     async landlordLogin(data:{email:string;password:string; rememberMe: boolean}){
        const response = await axiosInstance.post('/auth/landlord/login',data)
        return response.data
    },


     async landlordForgotPassword(data: { email: string }) {
    const response = await axiosInstance.post('/auth/landlord/forgot-password', data); 
    return response.data;

     },

    async logout() {
    await axiosInstance.post('/auth/logout');
  }
}