"use client";
import React from "react";
import defaultUser from "@/assets/images/default_user.svg";
import Image from "next/image";
import useOpenModal from "@/hooks/useOpenModal"; // Import hook
import { User } from "@/types/user.type";

const AccountSwitcher = ({ user }: { user: User }) => {
  const { openModal } = useOpenModal();

  return (
    <div className="flex items-center gap-2 w-full justify-between">
      <div className="flex items-center gap-1">
        <Image src={defaultUser} alt="default user" width={44} height={44} />
        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium">{user?.username}</span>
          <span className="text-sm">{user?.fullname}</span>
        </div>
      </div>
      <button
        className="text-xs font-bold px-0 text-blue-500 hover:underline cursor-pointer"
        onClick={() => openModal("login")}
      >
        Chuyển
      </button>
    </div>
  );
};

export default AccountSwitcher;
