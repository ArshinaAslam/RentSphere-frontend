
export const AUTH_ROUTES = {
  // User
  SIGNUP: '/auth/signup',
  VERIFY_OTP: '/auth/verify-otp',
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  GOOGLE_AUTH: '/auth/google-auth',
  RESEND_OTP: '/auth/resend-otp',
  LOGOUT: '/auth/logout',
  
  // Landlord  
  LANDLORD_LOGIN: '/auth/landlord/login',
  LANDLORD_FORGOT_PASSWORD: '/auth/landlord/forgot-password',

  //Admin
  ADMIN_LOGIN:'/admin/auth/login',
  
  
} as const;






