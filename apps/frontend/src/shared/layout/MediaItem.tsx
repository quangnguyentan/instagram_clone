// components/MediaItem.tsx
import React from "react";
import Image from "next/image";
import { Media } from "@/types/post.type";
import useModalStore from "@/stores/modalStore";

interface MediaItemProps {
  item: Media;
  refCallback?: (el: HTMLVideoElement | null) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ item, refCallback }) => {
  const { type } = useModalStore();
  return (
    <div className="flex items-center justify-center bg-black">
      {/* ép khung vuông giống Instagram */}
      <div
        className={
          type === "comment"
            ? "relative w-full aspect-8/6 overflow-hidden"
            : "relative w-full aspect-square overflow-hidden"
        }
      >
        {item.mediaType === "image" && (
          <Image
            src={item.url}
            alt={item.public_id}
            fill
            className="object-cover" // crop ảnh cho đầy khung
            sizes="100vw"
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
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default MediaItem;
