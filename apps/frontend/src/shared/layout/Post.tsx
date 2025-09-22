import { Post as PostType } from "@/types/post.type";
import React from "react";
import PostCard from "./PostCard";

const Post = ({ posts }: { posts: PostType[] }) => {
  return (
    <div className="w-full relative">
      <div className="flex flex-col gap-4 max-w-[500px]  absolute right-0 top-0 translate-x-[-30%]">
        {posts?.map((post) => (
          <PostCard key={post?._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Post;
