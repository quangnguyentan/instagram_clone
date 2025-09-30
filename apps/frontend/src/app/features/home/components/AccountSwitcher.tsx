"use client";
import React from "react";
import defaultUser from "@/assets/images/default_user.svg";
import Image from "next/image";
import useOpenModal from "@/hooks/useOpenModal";
import { User } from "@/types/user.type";

const AccountSwitcher = ({ user }: { user: User }) => {
  const { openModal } = useOpenModal();

  return (
    <div className="flex items-center justify-between w-full">
      {/* Avatar + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={user?.avatarUrl || defaultUser}
            alt="default user"
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate">{user?.username}</span>
          <span className="text-sm text-gray-500 truncate">
            {user?.fullname}
          </span>
        </div>
      </div>

      {/* Switch button */}
      <button
        className="text-xs font-bold text-blue-500 hover:underline flex-shrink-0 cursor-pointer"
        onClick={() => openModal("login")}
      >
        Chuyển
      </button>
    </div>
  );
};

export default AccountSwitcher;
