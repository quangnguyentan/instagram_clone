"use client";
import AccountSwitcher from "@/app/features/home/components/AccountSwitcher";
import Feed from "@/shared/layout/Feed";
import FriendSuggestions from "@/app/features/home/components/FriendSuggestions";

export default function HomePage() {
  return (
    <div className="h-full w-full flex items-center">
      <div className="h-full" style={{ width: "calc(100% - 600px)" }}>
        <Feed />
      </div>
      <div className="h-full" style={{ width: "600px" }}>
        <div className="w-1/2 flex flex-col gap-4">
          <AccountSwitcher />
          <FriendSuggestions />
        </div>
      </div>
    </div>
  );
}
