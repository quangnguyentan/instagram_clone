export type NotificationType = "like" | "comment" | "follow" | "mention";

export interface Notification {
  id: string;
  user: string; // recipient
  fromUser: string; // who triggered
  post?: string | null;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
