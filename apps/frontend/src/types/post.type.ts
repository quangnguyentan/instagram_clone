// types/post.ts
export interface Media {
  url: string;
  public_id: string;
}

export interface Post {
  id: string;
  user: string; // userId
  caption?: string;
  media: Media[];
  mediaType: "image" | "video";
  likes: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
