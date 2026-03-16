export interface ChatParticipant {
  _id:       string;
  firstName: string;
  lastName:  string;
  avatar?:   string;
}

export interface Conversation {
  _id:           string;
  tenantId:      ChatParticipant;
  landlordId:    ChatParticipant;
  lastMessage:   string;
  lastMessageAt: string;
  unreadCount:   number;
  status:        'active' | 'closed';
  lastMessageSenderRole?: 'tenant' | 'landlord';
}

export interface Message {
  _id:            string;
  conversationId: string;
  senderId:       string;
  senderRole:     'tenant' | 'landlord';
  content:        string;
  isRead:         boolean;
  createdAt:      string;
}

export interface ChatState {
  conversations:      Conversation[];
  activeConversation: Conversation | null;
  messages:           Message[];
  
  isLoadingConvos:    boolean;
  isLoadingMessages:  boolean;
  isSending:          boolean;
  isTyping:           boolean;
  error:              string | null;
}