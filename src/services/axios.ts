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
        await axios.post('http://localhost:3500/api/auth/refresh');
        
        console.log('Token refreshed → Retrying request');
        return axiosInstance(error.config!);
      } catch (refreshError) {
        console.log('Refresh failed → Logging out');
   
        window.location.href = '/tenant/login';
      }
    }
    return Promise.reject(error);
  }
);

 export default axiosInstance;


// import axios from "axios";


// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3500/api",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   withCredentials: true
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
//     if (error.response?.status === 401 && !error.config?._retry) {

//       // Prevent infinite loop: if the failed request is the refresh endpoint, don't retry
//       if (error.config?.url?.includes('/refresh')) {
//         if (!window.location.pathname.includes('/login')) {
//           window.location.href = '/';
//         }
//         return Promise.reject(error);
//       }

//       // If login fails, just reject (let component show error)
//       if (error.config?.url?.includes('/')) {
//         return Promise.reject(error);
//       }

//       error.config!._retry = true;

//       try {
//         console.log('Token expired → Auto-refreshing...');
//         await axiosInstance.post('/auth/refresh');

//         console.log('Token refreshed → Retrying request');
//         return axiosInstance(error.config!);
//       } catch (refreshError) {
//         console.log('Refresh failed → Logging out');

//         window.location.href = '/';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;