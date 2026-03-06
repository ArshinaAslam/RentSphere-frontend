
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
  
  
} as const;




// sexport const AUTH_API = {
//   // Tenant
//   SIGNUP:               '/auth/tenant/signup',
//   VERIFY_OTP:           '/auth/tenant/verify-otp',
//   RESEND_OTP:           '/auth/tenant/resend-otp',
//   LOGIN:                '/auth/tenant/login',
//   FORGOT_PASSWORD:      '/auth/tenant/forgot-password',
//   RESET_PASSWORD:       '/auth/tenant/reset-password',
//   EDIT_PROFILE:         '/auth/tenant/editProfile',
//   CHANGE_PASSWORD:      '/auth/tenant/change-password',

//   // Landlord
//   LANDLORD_SIGNUP:          '/auth/landlord/signup',
//   LANDLORD_VERIFY_OTP:      '/auth/landlord/verify-otp',
//   LANDLORD_LOGIN:           '/auth/landlord/login',
//   LANDLORD_FORGOT_PASSWORD: '/auth/landlord/forgot-password',
//   LANDLORD_EDIT_PROFILE:    '/auth/landlord/editProfile',
//   LANDLORD_CHANGE_PASSWORD: '/auth/landlord/change-password',

//   // Shared
//   GOOGLE_AUTH: '/auth/google',
//   LOGOUT:      '/auth/logout',

//   // Admin
//   ADMIN_LOGIN: '/auth/admin/login',
// };

