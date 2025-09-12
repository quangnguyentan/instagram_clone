export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  content?: string;
  mediaUrl?: string;
  createdAt: string;
  updatedAt: string;
}
