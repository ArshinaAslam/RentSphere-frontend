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


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface GetMessagesResult {
  messages: Message[];
  total:    number;
  page:     number;
  limit:    number;
}


export interface UploadResult {
  url: string;
}

export interface AttachmentResult {
  url:          string;
  originalName: string;
}