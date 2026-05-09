
export const NOTIFICATION_ROUTES = {
  GET_ALL:       "/notifications/get-notifications",
  UNREAD_COUNT:  "/notifications/unread-count",
  MARK_READ:     (notificationId: string) => `/notifications/${notificationId}/read`,
  MARK_ALL_READ: "/notifications/read-all",
};