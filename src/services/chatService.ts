import { CHAT_ROUTES } from "@/constants/chatRoutes";

import axiosInstance from "./axios";


export const chatService = {
  async startConversation(data: {
    tenantId:   string;
    landlordId: string;
    
    inquiryId?: string;
    message?:   string;
  }) {
    const res = await axiosInstance.post(CHAT_ROUTES.START_CONVERSATION, data);
    return res.data;
  },

  async sendMessage(data: {
    conversationId: string;
    senderId:       string;
    senderRole:     string;
    content:        string;
  }) {
    const res = await axiosInstance.post(CHAT_ROUTES.SEND_MESSAGE, data);
    return res.data;
  },

  async getLandlordConversations(landlordId: string) {
    const res = await axiosInstance.get(CHAT_ROUTES.LANDLORD_CONVERSATIONS, {
      params: { landlordId },
    });
    return res.data;
  },

  async getTenantConversations(tenantId: string) {
    const res = await axiosInstance.get(CHAT_ROUTES.TENANT_CONVERSATIONS, {
      params: { tenantId },
    });
    return res.data;
  },

  async getMessages(conversationId: string, page = 1, limit = 50) {
    const res = await axiosInstance.get(CHAT_ROUTES.MESSAGES, {
      params: { conversationId, page, limit },
    });
    return res.data;
  },

  async markAsRead(conversationId: string, userId: string) {
    const res = await axiosInstance.patch(CHAT_ROUTES.MARK_READ, {
      conversationId,
      userId,
    });
    return res.data;
  },

  uploadVoiceMessage: (audioBlob: Blob)=> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice.webm');
  return axiosInstance.post(CHAT_ROUTES.SEND_VOICE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
},

getCallHistory: () =>{
  return axiosInstance.get(CHAT_ROUTES.CALL_HISTORY)
}
};

