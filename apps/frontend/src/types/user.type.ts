export interface User {
  _id: string; // _id trong MongoDB
  username: string;
  email: string;
  role: "user" | "admin";
  refreshoken: string;
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  followers: string[]; // ObjectId -> string
  following: string[];
  createdAt: string;
  updatedAt: string;
}
