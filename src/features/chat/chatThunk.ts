import { createAsyncThunk } from "@reduxjs/toolkit";

import { chatService }      from "@/services/chatService";

export const fetchLandlordConversations = createAsyncThunk(
  "chat/fetchLandlordConversations",
  async (landlordId: string, { rejectWithValue }) => {
    try {
      const res = await chatService.getLandlordConversations(landlordId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch conversations");
    }
  }
);

export const fetchTenantConversations = createAsyncThunk(
  "chat/fetchTenantConversations",
  async (tenantId: string, { rejectWithValue }) => {
    try {
      const res = await chatService.getTenantConversations(tenantId);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch conversations");
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (
    { conversationId, page = 1, limit = 50 }: {
      conversationId: string;
      page?:          number;
      limit?:         number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await chatService.getMessages(conversationId, page, limit);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch messages");
    }
  }
);

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async (
    data: {
      conversationId: string;
      senderId:       string;
      senderRole:     "tenant" | "landlord";
      content:        string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await chatService.sendMessage(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  }
);

export const startConversationThunk = createAsyncThunk(
  "chat/startConversation",
  async (
    data: {
      tenantId:   string;
      landlordId: string;
      
      inquiryId?: string;
      message?:   string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await chatService.startConversation(data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to start conversation");
    }
  }
);

export const markAsReadThunk = createAsyncThunk(
  "chat/markAsRead",
  async (
    { conversationId, userId }: { conversationId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      await chatService.markAsRead(conversationId, userId);
      return conversationId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed");
    }
  }
);

export const uploadVoiceMessageThunk = createAsyncThunk(
  'chat/uploadVoiceMessage',
  async (audioBlob: Blob, { rejectWithValue }) => {
    try {
      const res = await chatService.uploadVoiceMessage(audioBlob);
      return res.data.data.url;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to upload voice message');
    }
  }
  
);

export const fetchCallHistory = createAsyncThunk(
  'chat/fetchCallHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await chatService.getCallHistory(userId);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed');
    }
  }
);