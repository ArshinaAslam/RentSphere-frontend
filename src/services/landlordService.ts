import type { PasswordValues } from "@/constants/authValidation";
import type {
  ChangePasswordResponse,
  EditProfileResponse,
} from "@/features/landlord/types";

import axiosInstance from "./axios";

export const landlordService = {
  async editLandlordProfile(formData: FormData): Promise<EditProfileResponse> {
    const response = await axiosInstance.post<EditProfileResponse>(
      "/landlord/profile/editProfile",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  async changeLandlordPassword(
    data: PasswordValues,
  ): Promise<ChangePasswordResponse> {
    const response = await axiosInstance.post<ChangePasswordResponse>(
      "/landlord/profile/change-password",
      data,
    );
    return response.data;
  },
};
