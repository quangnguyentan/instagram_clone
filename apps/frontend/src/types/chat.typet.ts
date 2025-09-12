export interface Chat {
  _id: string;
  members: string[];
  lastMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}
