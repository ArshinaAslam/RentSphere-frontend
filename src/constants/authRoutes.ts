
export const AUTH_ROUTES = {
  // Tenant
  TENANT_SIGNUP: '/auth/tenant/signup',
  TENANT_VERIFY_OTP: '/auth/tenant/verify-otp',
  TENANT_LOGIN: '/auth/tenant/login',
  TENANT_FORGOT_PASSWORD: '/auth/tenant/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Landlord  
  LANDLORD_SIGNUP: '/auth/landlord/signup',
  LANDLORD_VERIFY_OTP: '/auth/landlord/verify-otp',
  LANDLORD_LOGIN: '/auth/landlord/login',
  LANDLORD_FORGOT_PASSWORD: '/auth/landlord/forgot-password',

  //Admin
  ADMIN_LOGIN:'/auth/admin/login',
  
  // Shared
  GOOGLE_AUTH: '/auth/google-auth',
  RESEND_OTP: '/auth/resend-otp',
  LOGOUT: '/auth/logout',
} as const;
