export const INQUIRY_ROUTES = {
  CREATE_INQUIRY: '/tenant/inquiry/create-inquiry',
  TENANT_INQUIRIES: '/tenant/inquiry/my-inquiries',


  LANDLORD_INQUIRIES:   '/landlord/inquiry/all-inquiries',
  MARK_AS_READ: (inquiryId: string) => `/landlord/inquiry/${inquiryId}/read`,
};