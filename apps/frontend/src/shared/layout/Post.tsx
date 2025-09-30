import { Post as PostType } from "@/types/post.type";
import React from "react";
import PostCard from "./PostCard";

const Post = ({ posts }: { posts: PostType[] }) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col gap-4 w-full max-w-[500px]">
        {posts?.map((post) => (
          <PostCard key={post?._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Post;
