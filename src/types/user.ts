export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "TENANT" | "LANDLORD";
  isEmailVerified: boolean;
  isActive: boolean;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface EditProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "TENANT" | "LANDLORD";
  isEmailVerified: boolean;
  isActive: boolean;
}

export interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProfileOverviewUser {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: "TENANT" | "LANDLORD" | "ADMIN";
  avatar?: string;

  aadharNumber?: string;
  panNumber?: string;

  aadharFrontUrl?: string;
  aadharBackUrl?: string;
  panFrontUrl?: string;
}
