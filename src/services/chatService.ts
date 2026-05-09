import { CHAT_ROUTES } from "@/constants/chatRoutes";
import type {
  ApiResponse,
  AttachmentResult,
  Conversation,
  GetMessagesResult,
  Message,
  UploadResult,
} from "@/features/chat/types";

import axiosInstance from "./axios";

import type { AxiosResponse } from "axios";

export const chatService = {
  startConversation: (data: {
    tenantId: string;
    landlordId: string;
    inquiryId?: string;
    message?: string;
  }): Promise<AxiosResponse<ApiResponse<Conversation>>> =>
    axiosInstance.post(CHAT_ROUTES.START_CONVERSATION, data),

  sendMessage: (data: {
    conversationId: string;
    senderId: string;
    senderRole: string;
    content: string;
  }): Promise<AxiosResponse<ApiResponse<Message>>> =>
    axiosInstance.post(CHAT_ROUTES.SEND_MESSAGE, data),

  getLandlordConversations: (
    landlordId: string,
  ): Promise<AxiosResponse<ApiResponse<Conversation[]>>> =>
    axiosInstance.get(CHAT_ROUTES.LANDLORD_CONVERSATIONS, {
      params: { landlordId },
    }),

  getTenantConversations: (
    tenantId: string,
  ): Promise<AxiosResponse<ApiResponse<Conversation[]>>> =>
    axiosInstance.get(CHAT_ROUTES.TENANT_CONVERSATIONS, {
      params: { tenantId },
    }),

  getMessages: (
    conversationId: string,
    page = 1,
    limit = 50,
  ): Promise<AxiosResponse<ApiResponse<GetMessagesResult>>> =>
    axiosInstance.get(CHAT_ROUTES.MESSAGES, {
      params: { conversationId, page, limit },
    }),

  markAsRead: (
    conversationId: string,
    userId: string,
  ): Promise<AxiosResponse<ApiResponse<null>>> =>
    axiosInstance.patch(CHAT_ROUTES.MARK_READ, { conversationId, userId }),

  uploadVoiceMessage: (
    audioBlob: Blob,
  ): Promise<AxiosResponse<ApiResponse<UploadResult>>> => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "voice.webm");
    return axiosInstance.post(CHAT_ROUTES.SEND_VOICE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getCallHistory: (): Promise<AxiosResponse<ApiResponse<Message[]>>> =>
    axiosInstance.get(CHAT_ROUTES.CALL_HISTORY),

  uploadAttachment: (
    file: File,
  ): Promise<AxiosResponse<ApiResponse<AttachmentResult>>> => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post(CHAT_ROUTES.UPLOAD_ATTACHMENT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
