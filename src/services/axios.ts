// import axios from "axios";


// const axiosInstance = axios.create({
//     baseURL:"http://localhost:3500/api",
//     headers:{
//         "Content-Type":"application/json"
//     },
//     withCredentials:true
// })

// axiosInstance.interceptors.request.use(
//   (config) => {
//     console.log('API Request:', config.method?.toUpperCase(), config.url);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//       const originalRequest = error.config;
//         if (originalRequest?.url?.includes('/auth/refresh')) {
//       return Promise.reject(error);
//     }

//     if (error.response?.status === 401 && !error.config?._retry) {
//       error.config!._retry = true;
      
//       try {
//         console.log('Token expired → Auto-refreshing...');
//         await axiosInstance.post('/auth/refresh');
        
//         console.log('Token refreshed → Retrying request');
//         return axiosInstance(error.config);
//       } catch (refreshError) {
//         console.log('Refresh failed → Logging out');

//         const publicUrl = [
//           '/','/account-type',
//           "/tenant/login","/landlord/login",'/admin/login',
//           "/tenant/signup",'/landlord/signup',
//           '/tenant/verify-otp','/landlord/verify-otp',
//           '/tenant/forgot-password','/landlord/forgot-password',
//           '/tenant/forgot-verify-otp','/landlord/forgot-verify-otp',
//           '/tenant/reset-password','/landlord/reset-password',
//           '/landlord/kyc-details','/landlord/kyc-pending'
          

//         ];

//       const isPublic = publicUrl.some(url => window.location.pathname === url);

//         if(!isPublic){
//           window.location.href = '/';
//         }

//         return Promise.reject(error);
   
//       }
//     }
//     return Promise.reject(error);
//   }
// );

//  export default axiosInstance;

import axios from "axios";

import type { AxiosError, InternalAxiosRequestConfig } from "axios";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.warn("API Request:", config.method?.toUpperCase(), config.url);
    
    if (typeof document !== "undefined") {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (originalRequest?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (originalRequest) {
        originalRequest._retry = true;
      }

      try {
        console.warn("Token expired → Auto-refreshing...");
        await axiosInstance.post("/auth/refresh");

        console.warn("Token refreshed → Retrying request");
        return axiosInstance(originalRequest!);
      } catch (refreshError) {
        console.warn("Refresh failed → Logging out");

        const publicUrls = [
          "/",
          "/account-type",
          "/tenant/login",
          "/landlord/login",
          "/admin/login",
          "/tenant/signup",
          "/landlord/signup",
          "/tenant/verify-otp",
          "/landlord/verify-otp",
          "/tenant/forgot-password",
          "/landlord/forgot-password",
          "/tenant/forgot-verify-otp",
          "/landlord/forgot-verify-otp",
          "/tenant/reset-password",
          "/landlord/reset-password",
          "/landlord/kyc-details",
          "/landlord/kyc-pending",
        ];

        const isPublic = publicUrls.some(
          (url) => window.location.pathname === url
        );

        if (!isPublic) {
          window.location.href = "/";
        }

        return Promise.reject(
          refreshError instanceof Error
            ? refreshError
            : new Error("Token refresh failed")
        );
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;