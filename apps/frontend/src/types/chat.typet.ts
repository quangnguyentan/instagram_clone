export interface Chat {
  id: string;
  members: string[];
  lastMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}
