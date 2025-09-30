"use client";

import React, { useState } from "react";
import Stories from "react-insta-stories";
import { Story } from "@/types/story.type";
import Image from "next/image";

interface StoryCarouselProps {
  stories: Story[];
}

export default function StoryCarousel({
  stories,
}: Readonly<StoryCarouselProps>) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);

  const mapToInstaStories = (story: Story) => [
    {
      url: story.mediaUrl,
      type: story.mediaType === "video" ? "video" : "image",
      duration: 5000,
    },
  ];

  if (activeStory) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <Stories
          stories={mapToInstaStories(activeStory)}
          defaultInterval={5000}
          width="100%"
          height="100%"
          onAllStoriesEnd={() => setActiveStory(null)}
        />
        <button
          className="absolute top-4 right-4 text-white text-2xl font-bold"
          onClick={() => setActiveStory(null)}
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-2 max-w-[600px] mx-auto">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2">
        {stories.map((story, index) => (
          <button
            key={index}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setActiveStory(story)}
          >
            <div className="w-16 h-16 rounded-full border-2 border-pink-500 overflow-hidden flex-shrink-0">
              <Image
                src={story.user.avatarUrl || "/default-avatar.png"}
                alt={story.user.fullname}
                className="w-full h-full object-cover"
                width={64}
                height={64}
                priority
              />
            </div>
            <span className="text-xs mt-1 truncate max-w-[64px] text-center">
              {story.user.fullname}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
