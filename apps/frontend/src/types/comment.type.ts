import { Post } from "./post.type";
import { User } from "./user.type";

export interface Comment {
  _id: string;
  post: Post;
  user: User;
  parent?: Comment;
  content: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}
