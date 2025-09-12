import React, { useRef, useState } from "react";
import { Carousel } from "antd";
import { Post } from "@/types/post.type";
import Image from "next/image";

interface BaseCarouselProps {
  infinite?: boolean;
  arrows?: boolean;
  autoplay?: boolean;
  autoplaySpeed?: number;
  dots?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  data?: Post;
}

const BaseCarousel: React.FC<BaseCarouselProps> = ({
  infinite = false,
  arrows = false,
  autoplay = false,
  autoplaySpeed = 3000,
  dots = true,
  pauseOnHover = true,
  pauseOnFocus = true,
  data,
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
        {data?.media?.map((item, idx) => (
          <div
            className="flex items-center justify-center bg-black"
            key={item?.public_id}
          >
            <div className="relative mx-auto max-w-[500px] aspect-[4/5]">
              {item.mediaType === "image" && (
                <Image
                  src={item.url}
                  alt={data?.caption || ""}
                  className="object-contain"
                  fill
                />
              )}
              {item.mediaType === "video" && (
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={item.url}
                  muted
                  loop
                  controls
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default BaseCarousel;
