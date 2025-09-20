import Image from "next/image";
import React from "react";
import { User } from "@/types/user.type";
import defaultSuggestUser from "@/assets/images/default_suggest_user.jpg";
import FollowButton from "@/shared/layout/FollowButton";

interface FriendSuggestionsProps {
  suggestions: User[];
}

const FriendSuggestions = ({ suggestions }: FriendSuggestionsProps) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <span className="text-[13px] font-medium text-gray-400">
          Gợi ý cho bạn
        </span>
        <button className="text-xs font-medium">Xem tất cả</button>
      </div>

      {/* Friend list */}
      <div className="mt-3 space-y-3">
        {suggestions?.map((friend) => (
          <div key={friend._id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="w-11 h-11 border rounded-full">
                <Image
                  src={friend.avatarUrl || defaultSuggestUser}
                  alt={friend.fullname}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                />
              </div>

              <span className="text-sm font-medium truncate">
                {friend.fullname}
              </span>
            </div>

            {/* Follow button */}
            <FollowButton
              targetId={friend._id}
              isFollowing={friend?.followers?.includes(friend?._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions;
