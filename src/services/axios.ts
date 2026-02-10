import axios from "axios";


const axiosInstance = axios.create({
    baseURL:"http://localhost:3500/api",
    headers:{
        "Content-Type":"application/json"
    },
    withCredentials:true
})

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
      const originalRequest = error.config;
        if (originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !error.config?._retry) {
      error.config!._retry = true;
      
      try {
        console.log('Token expired → Auto-refreshing...');
        await axiosInstance.post('/auth/refresh');
        
        console.log('Token refreshed → Retrying request');
        return axiosInstance(error.config!);
      } catch (refreshError) {
        console.log('Refresh failed → Logging out');

        const publicUrl = [
          '/','/account-type',
          "/tenant/login","/landlord/login",'/admin/login',
          "/tenant/signup",'/landlord/signup',
          '/tenant/verify-otp','/landlord/verify-otp',
          '/tenant/forgot-password','/landlord/forgot-password',
          '/tenant/forgot-verify-otp','/landlord/forgot-verify-otp',
          '/tenant/reset-password','/landlord/reset-password',
          '/landlord/kyc-details','/landlord/kyc-pending'
          

        ];

        let isPublic = publicUrl.some(url => window.location.pathname === url);

        if(!isPublic){
          window.location.href = '/';
        }

        return Promise.reject(error);
   
      }
    }
    return Promise.reject(error);
  }
);

 export default axiosInstance;


