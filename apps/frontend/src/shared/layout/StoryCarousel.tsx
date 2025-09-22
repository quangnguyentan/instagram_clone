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
    <div className="w-full h-32 relative ">
      <div className="flex scrollbar-hide absolute left-0 top-0 translate-x-[60%] gap-4">
        {stories.map((story, index) => (
          <button
            key={index}
            className={`flex flex-col items-center cursor-pointer opacity-0 transform translate-y-4 animate-fadeUp`}
            // style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setActiveStory(story)}
          >
            <div className="w-16 h-16 rounded-full border-2 border-pink-500 overflow-hidden">
              <Image
                src={story.user.avatarUrl || "/default-avatar.png"}
                alt={story.user.fullname}
                className="w-full h-full object-cover"
                width={32}
                height={32}
                priority
              />
            </div>
            <span className="text-xs mt-1">{story.user.fullname}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
