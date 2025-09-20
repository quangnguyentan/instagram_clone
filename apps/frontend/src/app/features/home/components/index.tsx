"use client";
import AccountSwitcher from "@/app/features/home/components/AccountSwitcher";
import Post from "@/shared/layout/Post";
import FriendSuggestions from "@/app/features/home/components/FriendSuggestions";
import { useFeed, usePosts } from "@/hooks/usePosts";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { User } from "@/types/user.type";
import {
  useFollow,
  useGetFollowers,
  useGetFollowing,
  useSuggestions,
  useUnfollow,
} from "@/hooks/useUsers";

export default function HomePage() {
  // const { data: posts } = usePosts();
  const { data: feed } = useFeed();
  const { user } = useAuthStore();
  const { data: suggestions } = useSuggestions();
  const { data: followers } = useGetFollowers(user?._id || "");
  const { data: following } = useGetFollowing(user?._id || "");
  console.log(suggestions);
  return (
    <div className="h-full w-full flex items-center overflow-y-auto py-8 scrollbar-hide">
      <div
        className="h-full mx-auto w-full"
        style={{ width: "calc(100% - 600px)" }}
      >
        <Post posts={feed?.data?.docs || []} />
      </div>
      <div className="h-full" style={{ width: "600px" }}>
        <div className="w-1/2 flex flex-col gap-4">
          <AccountSwitcher user={user as User} />
          <FriendSuggestions suggestions={suggestions || []} />
        </div>
      </div>
    </div>
  );
}
