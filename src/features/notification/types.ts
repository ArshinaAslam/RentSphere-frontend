
export interface Notification {
  _id:       string;
  type:      string;
  title:     string;
  message:   string;
  isRead:    boolean;
  link?:     string;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount:   number;
  isLoading:     boolean;
}
export interface ErrorPayload {
  success: boolean;
  message: string;
}
