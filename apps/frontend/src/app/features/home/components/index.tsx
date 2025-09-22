"use client";
import AccountSwitcher from "@/app/features/home/components/AccountSwitcher";
import Post from "@/shared/layout/Post";
import FriendSuggestions from "@/app/features/home/components/FriendSuggestions";
import { useFeed } from "@/hooks/usePosts";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { User } from "@/types/user.type";
import {
  useGetFollowers,
  useGetFollowing,
  useSuggestions,
} from "@/hooks/useUsers";
import InstagramSkeleton from "@/shared/custom/InstagramSkeleton";

import sasuke from "@/assets/images/landing.png";
import { Story } from "@/types/story.type";
import StoryCarousel from "@/shared/layout/StoryCarousel";

export const storiesData: Story[] = [
  {
    _id: "s1",
    user: {
      _id: "u1",
      fullname: "Quang Nguyễn",
      avatarUrl: sasuke.src,
    },
    mediaUrl: sasuke.src,
    mediaType: "image",
    viewers: ["u2", "u3"],
    expireAt: "2025-09-30T23:59:59Z",
  },
  {
    _id: "s2",
    user: {
      _id: "u2",
      fullname: "An Phạm",
      avatarUrl: "/avatars/an.png",
    },
    mediaUrl: "/stories/story2.mp4",
    mediaType: "video",
    viewers: ["u1"],
  },
  {
    _id: "s3",
    user: {
      _id: "u3",
      fullname: "Lan Trần",
      avatarUrl: "/avatars/lan.png",
    },
    mediaUrl: "/stories/story3.jpg",
    mediaType: "image",
    viewers: [],
    expireAt: "2025-09-25T23:59:59Z",
  },
  {
    _id: "s4",
    user: {
      _id: "u4",
      fullname: "Minh Lê",
      avatarUrl: "/avatars/minh.png",
    },
    mediaUrl: "/stories/story4.mp4",
    mediaType: "video",
    viewers: ["u1", "u2", "u3"],
  },
  {
    _id: "s4",
    user: {
      _id: "u4",
      fullname: "Minh Lê",
      avatarUrl: "/avatars/minh.png",
    },
    mediaUrl: "/stories/story4.mp4",
    mediaType: "video",
    viewers: ["u1", "u2", "u3"],
  },
  {
    _id: "s4",
    user: {
      _id: "u4",
      fullname: "Minh Lê",
      avatarUrl: "/avatars/minh.png",
    },
    mediaUrl: "/stories/story4.mp4",
    mediaType: "video",
    viewers: ["u1", "u2", "u3"],
  },
  {
    _id: "s4",
    user: {
      _id: "u4",
      fullname: "Minh Lê",
      avatarUrl: "/avatars/minh.png",
    },
    mediaUrl: "/stories/story4.mp4",
    mediaType: "video",
    viewers: ["u1", "u2", "u3"],
  },
];

export default function HomePage() {
  const { data: feed, isLoading: isFeedLoading } = useFeed();
  const { user } = useAuthStore();
  const { data: suggestions, isLoading: isSuggestionsLoading } =
    useSuggestions();
  const { data: followers, isLoading: isFollowersLoading } = useGetFollowers(
    user?._id || ""
  );
  const { data: following, isLoading: isFollowingLoading } = useGetFollowing(
    user?._id || ""
  );
  const isLoading =
    isFeedLoading ||
    isSuggestionsLoading ||
    isFollowersLoading ||
    isFollowingLoading;
  return isLoading ? (
    <div className="h-full w-full flex items-start overflow-y-auto py-8 scrollbar-hide relative">
      <InstagramSkeleton loading={true} count={3} />
    </div>
  ) : (
    <div className="h-full w-full flex items-start overflow-y-auto py-8 scrollbar-hide relative">
      <div
        className="h-full mx-auto w-full"
        style={{ width: "calc(100% - 600px)" }}
      >
        <StoryCarousel stories={storiesData} />
        <Post posts={feed?.data?.docs || []} />
      </div>
      <div className="h-full" style={{ width: "600px" }}>
        <div className="w-1/2 flex flex-col gap-4">
          <AccountSwitcher user={user as User} />
          <FriendSuggestions
            suggestions={suggestions || []}
            currentUserId={user?._id || ""}
          />
        </div>
      </div>
    </div>
  );
}
