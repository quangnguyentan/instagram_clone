import AccountSwitcher from "@/components/layout/AccountSwitcher";
import Feed from "@/components/layout/Feed";
import FriendSuggestions from "@/components/layout/FriendSuggestions";

export default function Home() {
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
