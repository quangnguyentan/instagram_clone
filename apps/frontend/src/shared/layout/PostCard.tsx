import React from "react";
import { Post as PostType } from "@/types/post.type";
import PostInfo from "./PostCaption";
import PostMedia from "./PostMedia";

const PostCard = ({ post }: { post: PostType }) => {
  return (
    <div>
      <div className="w-full">
        <PostMedia media={post?.media} />
        <PostInfo post={post} />
      </div>
    </div>
  );
};

export default PostCard;
