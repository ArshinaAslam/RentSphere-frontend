import { EditProfileValues, PasswordValues, SignupValues } from "@/constants/authValidation";
import axiosInstance from "./axios";
import { AUTH_ROUTES } from "@/constants/authRoutes";

export const authService = {
    async tenantSignup(data:SignupValues & {role:string}){
        const response = await  axiosInstance.post(AUTH_ROUTES.TENANT_SIGNUP,data)
        return response.data
    },

    async landlordSignup(data:SignupValues & {role:string}){
        const response =await  axiosInstance.post(AUTH_ROUTES.LANDLORD_SIGNUP,data)
        return response.data
    },


     async googleAuth({ token, role }: { token: string; role: string }) {
        const response = await axiosInstance.post(AUTH_ROUTES.TENANT_GOOGLE_AUTH, { token, role });
        console.log("qwerqwer",response.data)
        return response.data;
    },



    async verifyTenantOtp(data:{email:string;otp:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.TENANT_VERIFY_OTP,data)
        return response.data
    },

      async verifyLandlordOtp(data:{email:string;otp:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.LANDLORD_VERIFY_OTP,data)
        return response.data
    },


    async resendOtp(data:{email:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.TENANT_RESEND_OTP,data)
        return response.data
    },


    async tenatLogin(data:{email:string;password:string; }){
        const response = await axiosInstance.post(AUTH_ROUTES.TENANT_LOGIN,data)
        return response.data
    },

    async tenantForgotPassword(data:{email:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.TENANT_FORGOT_PASSWORD,data)
        return response.data
    },

    async resetPassword(data:{password:string,confirmPassword:string}){
        const response = await axiosInstance.post(AUTH_ROUTES.TENANT_RESET_PASSWORD,data)
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
    await axiosInstance.post(AUTH_ROUTES.TENANT_LOGOUT,{},{withCredentials: true});
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