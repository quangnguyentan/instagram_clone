// types/post.ts
export interface Media {
  url: string;
  public_id: string;
  mediaType: "image" | "video";
}

export interface Post {
  _id: string;
  user: string; // userId
  caption?: string;
  media: Media[];
  likes: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
