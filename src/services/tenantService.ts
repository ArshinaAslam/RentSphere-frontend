import type { PasswordValues } from "@/constants/authValidation";
import { TENANT_ROUTES } from "@/constants/tenantRoutes";
import type {
  ChangePasswordResponse,
  EditProfileResponse,
} from "@/features/tenant/types";

import axiosInstance from "./axios";

export const tenantService = {
  async editTenantProfile(formData: FormData): Promise<EditProfileResponse> {
    const response = await axiosInstance.post<EditProfileResponse>(
      TENANT_ROUTES.PROFILE.EDIT,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  async changePassword(data: PasswordValues): Promise<ChangePasswordResponse> {
    const response = await axiosInstance.post<ChangePasswordResponse>(
      TENANT_ROUTES.PROFILE.CHANGE_PASSWORD,
      data,
    );
    return response.data;
  },
};
