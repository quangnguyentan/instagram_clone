import { Post as PostType } from "@/types/post.type";
import React from "react";
import PostCard from "./PostCard";

const Post = ({ posts }: { posts: PostType[] }) => {
  return (
    <div className="flex flex-col gap-4 max-w-[500px] mx-auto">
      {posts?.map((post) => (
        <PostCard key={post?._id} post={post} />
      ))}
    </div>
  );
};

export default Post;
