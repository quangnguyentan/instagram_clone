import { User } from "./user.type";

// types/post.ts
export interface Media {
  url: string;
  public_id: string;
  mediaType: "image" | "video";
}

export interface Post {
  _id: string;
  user: User;
  caption?: string;
  location?: string;
  media: Media[];
  likes: User[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
}
