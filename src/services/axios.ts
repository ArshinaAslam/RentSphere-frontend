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
    if (error.response?.status === 401 && !error.config?._retry) {
      error.config!._retry = true;
      
      try {
        console.log('Token expired → Auto-refreshing...');
        await axiosInstance.post('/auth/refresh');
        
        console.log('Token refreshed → Retrying request');
        return axiosInstance(error.config!);
      } catch (refreshError) {
        console.log('Refresh failed → Logging out');
   
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;