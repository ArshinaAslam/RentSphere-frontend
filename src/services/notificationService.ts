import { NOTIFICATION_ROUTES } from "@/constants/notificationRoutes";

import axiosInstance from "./axios";

export const notificationService = {
  async getAll() {
    const res = await axiosInstance.get(NOTIFICATION_ROUTES.GET_ALL);
    return res;
  },
  async getUnreadCount() {
    const res = await axiosInstance.get(NOTIFICATION_ROUTES.UNREAD_COUNT);
    return res;
  },
  async markAsRead(notificationId: string) {
    const res = await axiosInstance.patch(
      NOTIFICATION_ROUTES.MARK_READ(notificationId),
    );
    return res;
  },
  async markAllAsRead() {
    const res = await axiosInstance.patch(NOTIFICATION_ROUTES.MARK_ALL_READ);
    return res;
  },
};
