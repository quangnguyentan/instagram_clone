import React from "react";
import { Post as PostType } from "@/types/post.type";
import BaseCarousel from "../custom/BaseCarousel";

const PostCard = ({ post }: { post: PostType }) => {
  return (
    <div>
      <div className="w-[650px]">
        <BaseCarousel
          data={post}
          arrows={true}
          autoplay={true}
          autoplaySpeed={3000}
          dots={true}
          pauseOnHover={true}
          pauseOnFocus={true}
        />
      </div>
    </div>
  );
};

export default PostCard;
