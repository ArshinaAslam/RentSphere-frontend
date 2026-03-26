// constants/paymentRoutes.ts

export const PAYMENT_ROUTES = {
  // Tenant
  TENANT_DEPOSIT_ORDER:    '/tenant/payments/deposit/order',
  TENANT_RENT_ORDER:       '/tenant/payments/rent/order',
  TENANT_VERIFY_PAYMENT:   '/tenant/payments/verify',
  TENANT_PAYMENT_HISTORY:  '/tenant/payments/payment-history',

  // Landlord
  LANDLORD_PAYMENT_HISTORY:          '/landlord/payments/payment-history',
  LANDLORD_PAYMENTS_BY_PROPERTY: (propertyId: string) =>
    `/landlord/payments/property/${propertyId}`,
};