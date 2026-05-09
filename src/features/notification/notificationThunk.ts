import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { notificationService } from "@/services/notificationService";

import type { Notification, ErrorPayload } from "./types";

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: ErrorPayload }
>(
  "notification/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService.getAll();
    
      const responseData = res.data as {
  data: { notifications: Notification[] };
};

return responseData.data.notifications;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to fetch notifications",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  }
);

export const markNotificationRead = createAsyncThunk<
  string,
  string,
  { rejectValue: ErrorPayload }
>(
  "notification/markRead",
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to mark notification as read",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: ErrorPayload }
>(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
         const data = error.response?.data as { message?: string } | undefined;
        return rejectWithValue({
          success: false,
          message: data?.message || "Failed to mark all notifications as read",
        });
      }
      return rejectWithValue({ success: false, message: "Network error" });
    }
  }
);