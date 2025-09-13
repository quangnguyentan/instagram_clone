// components/MediaItem.tsx
import React from "react";
import Image from "next/image";
import { Media } from "@/types/post.type";

interface MediaItemProps {
  item: Media;
  refCallback?: (el: HTMLVideoElement | null) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ item, refCallback }) => {
  return (
    <div className="flex items-center justify-center bg-black">
      <div className="relative w-full aspect-[1/1] md:aspect-[3/4]">
        {item.mediaType === "image" && (
          <Image
            src={item.url}
            alt={item.public_id}
            className="object-contain w-full h-full"
            fill
          />
        )}
        {item.mediaType === "video" && (
          <video
            ref={refCallback}
            src={item.url}
            muted
            loop
            controls
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default MediaItem;
