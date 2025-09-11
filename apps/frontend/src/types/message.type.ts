export interface Message {
  id: string;
  chatId: string;
  sender: string;
  content?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
}
