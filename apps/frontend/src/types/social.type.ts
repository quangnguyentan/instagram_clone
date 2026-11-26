import { User } from "./user.type";

export type SocialUser = Pick<User, "_id" | "username" | "fullname" | "avatarUrl">;

export interface Story {
  _id: string;
  user: SocialUser;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption?: string;
  viewers: string[];
  likes?: string[];
  expireAt: string;
  createdAt: string;
}

export interface Reel {
  _id: string;
  user: SocialUser;
  caption?: string;
  mediaUrls: string[];
  mediaType: "video";
  likes: string[];
  createdAt: string;
}

export interface ReelComment {
  _id: string;
  reel: string;
  user: SocialUser;
  content: string;
  createdAt: string;
}

export interface SocialNotification {
  _id: string;
  type: "like" | "comment" | "follow" | "mention";
  fromUser: SocialUser;
  post?: { _id: string } | null;
  isRead: boolean;
  createdAt: string;
}

export interface DirectMessage {
  _id: string;
  chatId: string;
  sender: SocialUser;
  content?: string;
  mediaUrl?: string;
  createdAt: string;
}

export interface DirectChat {
  _id: string;
  members: SocialUser[];
  lastMessage?: DirectMessage | null;
  updatedAt: string;
}

export interface Report {
  _id: string;
  targetType: "user" | "post" | "reel" | "story" | "comment";
  targetId: string;
  reason: string;
  status: "pending" | "reviewed" | "dismissed";
  adminNote?: string;
  reportedBy: SocialUser;
  createdAt: string;
}
