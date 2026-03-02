
import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  type: z.string().min(1, "Property type is required"),
  bhk: z.string().min(1, "BHK configuration is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z
    .string()
    .length(6, "Pincode must be exactly 6 digits")
    .regex(/^\d+$/, "Pincode must contain only numbers"),

  price: z.string().min(1, "Monthly rent is required").refine(v => Number(v) > 0, "Rent must be greater than 0"),
  securityDeposit: z.string().min(1, "Security deposit is required").refine(v => Number(v) >0, "Security deposit must be greater than 0"),
  vacant: z.string().min(1, "Vacant units is required").refine(v => Number(v) >= 0, "Cannot be negative"),
  bedrooms: z.string().min(1, "Bedrooms is required").refine(v => Number(v) > 0, "Must be at least 1"),
  bathrooms: z.string().min(1, "Bathrooms is required").refine(v => Number(v) > 0, "Must be at least 1"),
  area: z.string().min(1, "Area is required").refine(v => Number(v) > 0, "Area must be greater than 0"),

  status: z.enum(["Available", "Active", "Pending", "Rented", "Inactive"]),
  furnishing: z.string().min(1, "Furnishing status is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const statusOptions = ["Available", "Active", "Pending", "Rented", "Inactive"];
export const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"];
export const propertyTypes = ["Apartment", "Villa", "House", "Studio", "Penthouse"];
export const furnishingOptions = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

export const amenitiesList = [
  { label: "WiFi", emoji: "📶" },
  { label: "Parking", emoji: "🚗" },
  { label: "Gym", emoji: "🏋️" },
  { label: "Security", emoji: "🔒" },
  { label: "Lift / Elevator", emoji: "🛗" },
  { label: "Air Conditioning", emoji: "❄️" },
  { label: "Gas Pipeline", emoji: "🔥" },
  { label: "Water Supply 24/7", emoji: "💧" },
  { label: "CCTV", emoji: "📷" },
  { label: "Garden / Park", emoji: "🌳" },
];