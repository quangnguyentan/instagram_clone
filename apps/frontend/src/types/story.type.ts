import { User } from "./user.type";

export interface Story {
  _id: string;
  user: User;
  mediaUrl: string;
  mediaType: "image" | "video";
  viewers: string[];
  expireAt?: string;
}
