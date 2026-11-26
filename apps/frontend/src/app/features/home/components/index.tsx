"use client";

import AccountSwitcher from "@/app/features/home/components/AccountSwitcher";
import FriendSuggestions from "@/app/features/home/components/FriendSuggestions";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { useFeed } from "@/hooks/usePosts";
import { useSuggestions } from "@/hooks/useUsers";
import { useStoriesFeed } from "@/hooks/useSocial";
import InstagramSkeleton from "@/shared/custom/InstagramSkeleton";
import Post from "@/shared/layout/Post";
import StoryCarousel from "@/shared/layout/StoryCarousel";
import { User } from "@/types/user.type";

export default function HomePage() {
  const { data: feed, isLoading: isFeedLoading, isError: feedError } = useFeed();
  const { user } = useAuthStore();
  const { data: suggestions, isLoading: isSuggestionsLoading } = useSuggestions();
  const { data: stories = [], isLoading: isStoriesLoading } = useStoriesFeed();

  if (isFeedLoading || isSuggestionsLoading || isStoriesLoading) {
    return (
      <div className="relative flex h-full w-full flex-col items-start justify-center gap-8 overflow-y-auto py-8 lg:flex-row">
        <InstagramSkeleton loading count={3} />
      </div>
    );
  }
  if (feedError) {
    return <p className="p-8 text-sm text-red-600">Không tải được bảng tin.</p>;
  }

  return (
    <div className="relative flex h-full w-full flex-col items-start justify-center gap-8 overflow-y-auto py-8 lg:flex-row">
      <div className="w-full max-w-[700px] flex-1">
        <StoryCarousel stories={stories} />
        <Post posts={feed?.docs ?? []} />
      </div>
      {user && (
        <div className="hidden w-[320px] flex-shrink-0 lg:block">
          <div className="sticky right-0 top-8 flex flex-col gap-6">
            <AccountSwitcher user={user as User} />
            <FriendSuggestions
              suggestions={suggestions ?? []}
              currentUserId={user._id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
