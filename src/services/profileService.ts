import type { PasswordValues } from "@/constants/authValidation";
import { PROFILE_ROUTES } from "@/constants/profileRoutes";

import axiosInstance from "./axios";

export const profileService = {
  async editTenantProfile(formData: FormData) {
    const response = await axiosInstance.post(
      PROFILE_ROUTES.TENANT_EDIT_PROFILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  },

  async editLandlordProfile(formData: FormData) {
    const response = await axiosInstance.post(
      PROFILE_ROUTES.LANDLORD_EDIT_PROFILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response;
  },

  async changePassword(data: PasswordValues) {
    const response = await axiosInstance.post(
      PROFILE_ROUTES.TENANT_CHANGE_PASSWORD,
      data,
    );
    return response;
  },

  async changeLandlordPassword(data: PasswordValues) {
    const response = await axiosInstance.post(
      PROFILE_ROUTES.LANDLORD_CHANGE_PASSWORD,
      data,
    );
    return response;
  },
};
