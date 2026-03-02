
export const AUTH_ROUTES = {
  // Tenant
  SIGNUP: '/auth/signup',
  VERIFY_OTP: '/auth/verify-otp',
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  GOOGLE_AUTH: '/auth/google-auth',
  RESEND_OTP: '/auth/resend-otp',
  LOGOUT: '/auth/logout',
  
  // Landlord  
  LANDLORD_SIGNUP: '/auth/landlord/signup',
  LANDLORD_VERIFY_OTP: '/auth/landlord/verify-otp',
  LANDLORD_LOGIN: '/auth/landlord/login',
  LANDLORD_FORGOT_PASSWORD: '/auth/landlord/forgot-password',

  //Admin
  ADMIN_LOGIN:'/admin/auth/login',
  
  // Shared
  // GET_CURRENT_USER: '/auth/me',
  
} as const;

