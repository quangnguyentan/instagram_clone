export interface Note {
  id: string;
  user: string;
  content: string;
  expireAt?: string; // Date -> string ISO
  createdAt: string;
  updatedAt: string;
}
