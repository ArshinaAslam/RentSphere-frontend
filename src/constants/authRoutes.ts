
export const AUTH_ROUTES = {
  // Tenant
  TENANT_SIGNUP: '/tenant/auth/signup',
  TENANT_VERIFY_OTP: '/tenant/auth/verify-otp',
  TENANT_LOGIN: '/tenant/auth/login',
  TENANT_FORGOT_PASSWORD: '/tenant/auth/forgot-password',
  TENANT_RESET_PASSWORD: '/tenant/auth/reset-password',
  TENANT_GOOGLE_AUTH: '/tenant/auth/google-auth',
  TENANT_RESEND_OTP: '/tenant/auth/resend-otp',
  TENANT_LOGOUT: '/tenant/auth/logout',
  
  // Landlord  
  LANDLORD_SIGNUP: '/auth/landlord/signup',
  LANDLORD_VERIFY_OTP: '/auth/landlord/verify-otp',
  LANDLORD_LOGIN: '/auth/landlord/login',
  LANDLORD_FORGOT_PASSWORD: '/auth/landlord/forgot-password',

  //Admin
  ADMIN_LOGIN:'/auth/admin/login',
  
  // Shared
  // GET_CURRENT_USER: '/auth/me',
  
} as const;
