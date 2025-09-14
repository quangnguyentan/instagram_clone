import React from "react";
import { Post as PostType } from "@/types/post.type";
import { User } from "@/types/user.type";

interface PostCaptionProps {
  caption: string;
  user: User;
}

const PostCaption = ({ caption, user }: PostCaptionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{user?.username}</span>
          <p className="text-sm">{caption}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCaption;
