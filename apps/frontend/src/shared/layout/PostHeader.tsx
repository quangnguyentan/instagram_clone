import { User } from "@/types/user.type";
import Image from "next/image";
import React from "react";
import defaultUser from "@/assets/images/default_user.svg";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import { EllipsisIcon } from "../ui/Icon";
const PostHeader = ({ user, createdAt }: { user: User; createdAt: string }) => {
  const label = useTimeAgo(createdAt);
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 text-sm items-center py-2 ">
        <Image
          src={user.avatarUrl || defaultUser}
          alt={user.username}
          width={28}
          height={28}
        />
        <span className="font-medium">{user.username}</span>
        <div className="flex gap-1 items-center">
          <span className="text-gray-500">&bull;</span>
          <span className="text-gray-500">{label}</span>
        </div>
      </div>
      <EllipsisIcon className="w-4 h-4" />
    </div>
  );
};

export default PostHeader;
