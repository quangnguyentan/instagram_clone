import { Media } from "@/types/post.type";
import React from "react";
import BaseCarousel from "../custom/BaseCarousel";

const PostMedia = ({ media }: { media: Media[] }) => {
  return (
    <div>
      <BaseCarousel
        media={media}
        arrows={true}
        autoplay={true}
        autoplaySpeed={3000}
        dots={true}
        pauseOnHover={true}
        pauseOnFocus={true}
      />
    </div>
  );
};

export default PostMedia;
