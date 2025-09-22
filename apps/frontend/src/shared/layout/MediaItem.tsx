import React, { useState } from "react";
import Image from "next/image";
import { Media } from "@/types/post.type";

interface MediaItemProps {
  item: Media;
  refCallback?: (el: HTMLVideoElement | null) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ item, refCallback }) => {
  const togglePlay = (video: HTMLVideoElement | null) => {
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div className="relative w-full max-w-[1280px] aspect-[1/1] overflow-hidden">
      {item.mediaType === "image" && (
        <Image
          src={item.url}
          alt={item.public_id}
          width={1280}
          height={1280}
          className="object-cover"
        />
      )}
      {item.mediaType === "video" && (
        <video
          ref={refCallback}
          src={item.url}
          muted
          loop
          autoPlay
          playsInline
          onClick={(e) => togglePlay(e.currentTarget)}
          className="w-full h-full object-contain bg-black cursor-pointer"
        />
      )}
    </div>
  );
};

export default MediaItem;
