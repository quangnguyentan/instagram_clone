import Image from "next/image";
import React from "react";
import insta from "@/assets/images/insta_icon.jpg";

const friendSuggestions = [
  { id: 1, name: "John Doe", avatar: insta },
  { id: 2, name: "Jane Doe", avatar: insta },
  {
    id: 3,
    name: "Johnathan Super Long Name That Will Be Truncated",
    avatar: insta,
  },
  { id: 4, name: "Jane Doe", avatar: insta },
];

const FriendSuggestions = () => {
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
        {friendSuggestions.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Image
                src={friend.avatar}
                alt={friend.name}
                width={44}
                height={44}
                className="rounded-full"
              />
              <span className="text-sm font-medium truncate">
                {friend.name}
              </span>
            </div>

            {/* Follow button */}
            <button className="text-xs font-bold text-blue-500">
              Theo dõi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions;
