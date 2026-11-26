import type { User } from "./user.type";

export interface Story {
  _id: string;
  user: Pick<User, "_id" | "fullname" | "avatarUrl">;
  mediaUrl: string;
  mediaType: "image" | "video";
  viewers: string[];
  expireAt?: string;
}
