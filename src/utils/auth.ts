import axiosInstance from '@/services/axios';

export const checkAuthStatus = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return { 
      isAuthenticated: true, 
      user: response.data.user 
    };
  } catch {
    return { isAuthenticated: false };
  }
};
