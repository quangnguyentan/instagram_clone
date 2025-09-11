export interface User {
  id: string; // _id trong MongoDB
  username: string;
  email: string;
  fullName?: string;
  role: "user" | "admin";
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  followers: string[]; // ObjectId -> string
  following: string[];
  createdAt: string;
  updatedAt: string;
}
