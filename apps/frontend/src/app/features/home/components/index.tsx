"use client";
import AccountSwitcher from "@/app/features/home/components/AccountSwitcher";
import Post from "@/shared/layout/Post";
import FriendSuggestions from "@/app/features/home/components/FriendSuggestions";
import { usePosts } from "@/hooks/usePosts";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { User } from "@/types/user.type";

export default function HomePage() {
  const { data: posts } = usePosts();
  const { user } = useAuthStore();
  return (
    <div className="h-full w-full flex items-center overflow-y-auto py-8 scrollbar-hide">
      <div
        className="h-full mx-auto w-full"
        style={{ width: "calc(100% - 600px)" }}
      >
        <Post posts={posts?.data?.docs || []} />
      </div>
      <div className="h-full" style={{ width: "600px" }}>
        <div className="w-1/2 flex flex-col gap-4">
          <AccountSwitcher user={user as User} />
          <FriendSuggestions />
        </div>
      </div>
    </div>
  );
}
