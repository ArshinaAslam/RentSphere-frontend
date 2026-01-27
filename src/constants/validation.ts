// Zod schemas for forms
import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(/^[\+]?[1-9][\d]{9,14}$/, "Enter valid phone (+91...)"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to terms & conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean()
});

export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;





const fileSchema = z
  .instanceof(File)
  .refine((file) => {
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    return acceptedTypes.includes(file.type);
  }, 'Only JPG, PNG, PDF allowed')
  .refine((file) => file.size <= 5 * 1024 * 1024, 'File must be less than 5MB');

export const kycFormSchema = z.object({
   email: z.string().email('Invalid email'),
  aadhaarNumber: z.string()
    .regex(/^\d{12}$/, 'Aadhaar must be 12 digits')
    .transform((val) => val.trim()),
  panNumber: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, 'PAN must be 10 characters (e.g. ABCDE1234F)')
    .transform((val) => val.toUpperCase().trim()),
  aadhaarFront: fileSchema ,
  aadhaarBack: fileSchema ,
  panCard: fileSchema,
  selfie: fileSchema,
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to KYC consent',
  }),
});

export type KycFormValues = z.infer<typeof kycFormSchema>;


export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;



export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[0-9]/, 'Include at least 1 number')
    .regex(/[^A-Za-z0-9]/, 'Include at least 1 special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
























