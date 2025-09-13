import React, { useRef, useState } from "react";
import { Carousel } from "antd";
import { Media, Post } from "@/types/post.type";
import Image from "next/image";
import MediaItem from "../layout/MediaItem";

interface BaseCarouselProps {
  infinite?: boolean;
  arrows?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
  dots?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  media?: Media[];
}

const BaseCarousel: React.FC<BaseCarouselProps> = ({
  infinite = false,
  arrows = false,
  autoplay = false,
  autoplaySpeed = 3000,
  dots = true,
  pauseOnHover = true,
  pauseOnFocus = true,
  media,
}) => {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const handleAfterChange = (index: number) => {
    setCurrent(index);
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === index) {
        video.play().catch(() => {});
      } else {
        video.pause();
        // video.currentTime = 0; // reset về đầu
      }
    });
  };
  return (
    <div className="w-full">
      <Carousel
        arrows={arrows}
        infinite={infinite}
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed}
        dots={dots}
        pauseOnHover={pauseOnHover}
        pauseOnFocus={pauseOnFocus}
        className="w-full"
        afterChange={handleAfterChange}
      >
        {media?.map((item, idx) => (
          <MediaItem
            key={item?.public_id}
            item={item}
            refCallback={(el) => {
              videoRefs.current[idx] = el;
            }}
          />
        ))}
      </Carousel>
    </div>
  );
};

export default BaseCarousel;
