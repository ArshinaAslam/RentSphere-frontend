import { createSlice } from "@reduxjs/toolkit";

import {
  fetchLandlordConversations,
  fetchMessages,
  fetchTenantConversations,
  sendMessageThunk,
} from "./chatThunk";

import type { ChatState, Conversation, Message } from "./types";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatState = {
  conversations:      [],
  activeConversation: null,
  messages:           [],
  isLoadingConvos:    false,
  isLoadingMessages:  false,
  isSending:          false,
  isTyping:           false,
  error:              null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<Conversation>) => {
      state.activeConversation = action.payload;
    },
    clearChat: (state) => {
      state.messages           = [];
      state.activeConversation = null;
    },
    appendMessage: (state, action: PayloadAction<Message>) => {
     
      const exists = state.messages.find(m => m._id === action.payload._id);
      if (!exists) state.messages.push(action.payload);

     
      const conv = state.conversations.find(
        c => c._id === action.payload.conversationId
      );
      if (conv) {
        conv.lastMessage   = action.payload.content;
        conv.lastMessageAt = action.payload.createdAt;
        if (action.payload.senderRole !== 'landlord') {
          conv.unreadCount += 1;
        }
      }
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    clearUnread: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find(c => c._id === action.payload);
      if (conv) conv.unreadCount = 0;
    },
    resetActiveConversation: (state) => {
  state.activeConversation = null;
  state.messages           = [];
},
markMessagesAsRead: (state, action: PayloadAction<string>) => {
  state.messages = state.messages.map(msg =>
    msg.conversationId === action.payload
      ? { ...msg, isRead: true }
      : msg
  );
},
  },
  extraReducers: (builder) => {
    builder
      // Fetch landlord conversations
      .addCase(fetchLandlordConversations.pending, (state) => {
        state.isLoadingConvos = true;
        state.error           = null;
      })
      .addCase(fetchLandlordConversations.fulfilled, (state, action) => {
        state.isLoadingConvos = false;
        state.conversations   = action.payload;
      })
      .addCase(fetchLandlordConversations.rejected, (state, action) => {
        state.isLoadingConvos = false;
        state.error           = action.payload as string;
      })
       // Fetch tenant conversations
      .addCase(fetchTenantConversations.pending, (state) => {
  state.isLoadingConvos = true;
  state.error           = null;
})
.addCase(fetchTenantConversations.fulfilled, (state, action) => {
  state.isLoadingConvos = false;
  state.conversations   = action.payload; 
})
.addCase(fetchTenantConversations.rejected, (state, action) => {
  state.isLoadingConvos = false;
  state.error           = action.payload as string;
})

      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoadingMessages = true;
        state.error             = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        state.messages          = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.isLoadingMessages = false;
      })

      // Send message 
      .addCase(sendMessageThunk.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.isSending = false;
        const exists = state.messages.find(m => m._id === action.payload._id);
        if (!exists) state.messages.push(action.payload);
      })
      .addCase(sendMessageThunk.rejected, (state) => {
        state.isSending = false;
      });
  },
});

export const {
  setActiveConversation,
  clearChat,
  appendMessage,
  setTyping,
  clearUnread,
  resetActiveConversation,
  markMessagesAsRead, 
} = chatSlice.actions;

export default chatSlice.reducer;