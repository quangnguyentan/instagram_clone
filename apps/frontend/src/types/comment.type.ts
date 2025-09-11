export interface Comment {
  id: string;
  post: string;
  user: string;
  parent?: string | null;
  content: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}
