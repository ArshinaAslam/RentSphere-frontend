import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";

import { chatService } from "@/services/chatService";

export const fetchLandlordConversations = createAsyncThunk(
  "chat/fetchLandlordConversations",
  async (landlordId: string, { rejectWithValue }) => {
    try {
      const res = await chatService.getLandlordConversations(landlordId);
      return res.data.data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed to fetch conversations"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const fetchTenantConversations = createAsyncThunk(
  "chat/fetchTenantConversations",
  async (tenantId: string, { rejectWithValue }) => {
    try {
      const res = await chatService.getTenantConversations(tenantId);
      return res.data.data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed to fetch conversations"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (
    {
      conversationId,
      page = 1,
      limit = 50,
    }: {
      conversationId: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await chatService.getMessages(conversationId, page, limit);
      return res.data.data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed to fetch messages"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async (
    data: {
      conversationId: string;
      senderId: string;
      senderRole: "tenant" | "landlord";
      content: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await chatService.sendMessage(data);
      return res.data.data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed to send message"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const startConversationThunk = createAsyncThunk(
  "chat/startConversation",
  async (
    data: {
      tenantId: string;
      landlordId: string;
      inquiryId?: string;
      message?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await chatService.startConversation(data);
      return res.data.data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed to start conversation"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const markAsReadThunk = createAsyncThunk(
  "chat/markAsRead",
  async (
    {
      conversationId,
      userId,
    }: { conversationId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      await chatService.markAsRead(conversationId, userId);
      return conversationId;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const uploadVoiceMessageThunk = createAsyncThunk(
  "chat/uploadVoiceMessage",
  async (audioBlob: Blob, { rejectWithValue }) => {
    try {
      const res = await chatService.uploadVoiceMessage(audioBlob);
      return res.data.data.url;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed to upload voice message"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const fetchCallHistory = createAsyncThunk(
  "chat/fetchCallHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await chatService.getCallHistory();
      return res.data.data;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);

export const uploadAttachmentThunk = createAsyncThunk(
  "chat/uploadAttachment",
  async (file: File, { rejectWithValue }) => {
    try {
      const res = await chatService.uploadAttachment(file);
      return res.data.data ;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        return rejectWithValue(
          data?.message || "Failed to upload"
        );
      }
      return rejectWithValue("Unexpected error occurred");
    }
  }
);