/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { Carousel } from "antd";
import { Media } from "@/types/post.type";
import MediaItem from "../layout/MediaItem";
import { LeftIcon, RightIcon } from "../ui/Icon";

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
  arrows = true,
  autoplay = false,
  autoplaySpeed = 3000,
  dots = true,
  pauseOnHover = true,
  pauseOnFocus = true,
  media,
}) => {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const carouselRef = useRef<any>(null); // Ref for controlling Carousel

  const handleAfterChange = (index: number) => {
    setCurrent(index);
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === index) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  };

  const goToPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const isFirstSlide = current === 0;
  const isLastSlide = media ? current === media.length - 1 : false;

  return (
    <div className="relative w-full max-w-[1280px] aspect-[1/1] group">
      <Carousel
        arrows={false} // Disable default arrows
        infinite={infinite}
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed}
        dots={dots}
        pauseOnHover={pauseOnHover}
        pauseOnFocus={pauseOnFocus}
        className="w-full"
        afterChange={handleAfterChange}
        ref={carouselRef}
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
      {arrows && (
        <>
          {(!isFirstSlide || infinite) && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                         bg-white/70 text-black/70 p-0.5 rounded-full 
                      opacity-100 transition cursor-pointer"
              onClick={goToPrev}
            >
              <LeftIcon width={22} height={22} />
            </button>
          )}
          {(!isLastSlide || infinite) && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
                         bg-white/70 text-black/70 p-0.5 rounded-full 
                      opacity-100 transition cursor-pointer"
              onClick={goToNext}
            >
              <RightIcon width={22} height={22} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BaseCarousel;
