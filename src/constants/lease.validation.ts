import { z } from 'zod';

export const createLeaseSchema = z.object({
  propertyId: z.string().min(1, 'Please select a property'),
  tenantId:   z.string().min(1, 'Please select a tenant'),

  rentAmount: z
    .number({ invalid_type_error: 'Rent amount is required' })
    .min(1, 'Rent amount must be greater than 0'),

  securityDeposit: z
    .number({ invalid_type_error: 'Security deposit is required' })
    .min(0, 'Security deposit cannot be negative'),

  paymentDueDay: z
    .number()
    .min(1, 'Payment due day must be between 1 and 31')
    .max(31, 'Payment due day must be between 1 and 31'),

  lateFee: z
    .number()
    .min(0, 'Late fee cannot be negative'),

  startDate: z.string().min(1, 'Start date is required'),

  endDate: z.string().min(1, 'End date is required'),

  leaseType: z.enum(['fixed', 'monthly']),

  petsAllowed:        z.boolean(),
  smokingAllowed:     z.boolean(),
  maxOccupants:       z.number().min(1, 'At least 1 occupant required'),
  noticePeriod:       z.number().min(0, 'Notice period cannot be negative'),
  utilitiesIncluded:  z.array(z.string()),
  termsAndConditions: z.string(),
}).refine(
  data => new Date(data.endDate) > new Date(data.startDate),
  { message: 'End date must be after start date', path: ['endDate'] }
).refine(
  data => data.securityDeposit <= data.rentAmount,
  { message: 'Security deposit cannot be greater than rent amount', path: ['securityDeposit'] }
);

export type CreateLeaseSchema = z.infer<typeof createLeaseSchema>;





export const updateLeaseSchema = z.object({
rentAmount: z
  .coerce.number({ message: 'Rent amount is required' })
  .refine(val => !isNaN(val) && val !== 0, { message: 'Rent amount is required' })
  .min(1, 'Rent amount must be greater than 0'),


 securityDeposit: z
  .coerce.number({ message: 'Security deposit is required' })
  .refine(val => !isNaN(val), { message: 'Security deposit is required' })
  .min(0, 'Security deposit cannot be negative'),


  paymentDueDay: z
    .number()
    .min(1, 'Payment due day must be between 1 and 31')
    .max(31, 'Payment due day must be between 1 and 31'),

  lateFee: z
    .number()
    .min(0, 'Late fee cannot be negative'),

  startDate: z.string().min(1, 'Start date is required'),
  endDate:   z.string().min(1, 'End date is required'),

  leaseType:          z.enum(['fixed', 'monthly']),
  petsAllowed:        z.boolean(),
  smokingAllowed:     z.boolean(),
  maxOccupants:       z.number().min(1, 'At least 1 occupant required'),
  noticePeriod:       z.number().min(0, 'Notice period cannot be negative'),
  utilitiesIncluded:  z.array(z.string()),
  termsAndConditions: z.string(),
}).refine(
  data => new Date(data.endDate) > new Date(data.startDate),
  { message: 'End date must be after start date', path: ['endDate'] }
).refine(
  data => data.securityDeposit <= data.rentAmount,
  { message: 'Security deposit cannot be greater than rent amount', path: ['securityDeposit'] }
);

export type UpdateLeaseSchema = z.infer<typeof updateLeaseSchema>;