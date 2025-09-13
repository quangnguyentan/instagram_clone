import React from "react";
import { Post as PostType } from "@/types/post.type";

const PostCaption = ({ post }: { post: PostType }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{post.user.username}</span>
          <p className="text-sm">{post.caption}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCaption;
