"use client";
import React, { useState } from "react";
import {
  ChevronDownIcon,
  CloseIcon,
  LoaderIcon,
  SearchIcon,
  SquarePenIcon,
} from "@/shared/ui/Icon";
import BasePanel from "@/shared/custom/BasePanel";
import { useAuthStore } from "../../auth/store/useAuthStore";
import avatar_default from "@/assets/images/avatar_default.jpg";
import Image from "next/image";
interface ConversationSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function ConversationSidebar({
  onClose,
  open,
}: ConversationSidebarProps) {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (value) {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    } else {
      setLoading(false);
    }
  };
  return (
    <BasePanel open={open} onClose={onClose} label="Tin nhắn">
      <div className="flex flex-col h-full gap-4 border-l-1">
        <div className="px-4 pt-6">
          <div className="flex items-center justify-between pb-8">
            <div className="flex items-center cursor-pointer">
              <h2 className="text-lg font-bold px-2">{user?.fullname}</h2>
              <ChevronDownIcon width={20} />
            </div>
            <SquarePenIcon strokeWidth={2.5} className="cursor-pointer" />
          </div>

          <div className="relative z-10 ">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full rounded-lg border-none bg-gray-200/60 py-3 pl-10 pr-3 text-sm placeholder:text-sm focus:outline-none"
              onChange={handleSearch}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {loading ? (
                <LoaderIcon className="w-4 h-4 animate-spin text-gray-500" />
              ) : search ? (
                <CloseIcon
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setSearch("")}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className="relative flex flex-col items-start px-4 justify-center">
          {/* Bubble */}
          <div className="relative bg-white text-gray-800 text-xs px-3 py-1 rounded-lg shadow-md">
            Ghi chú...
            {/* Mũi tên */}
            <div
              className="absolute -bottom-2 left-1/3 -translate-x-1/2 w-0 h-0 
                    border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
            ></div>
          </div>

          {/* Avatar */}
          <Image
            src={user?.avatarUrl || avatar_default}
            width={74}
            height={74}
            alt="avatar"
            className="rounded-full mt-3"
          />
          <span className="text-xs text-gray-500/90">Ghi chú của bạn</span>
        </div>
        {/* <div className="w-full h-[1.5px] bg-gray-200"></div> */}
        <div className="flex justify-between items-center px-6">
          <span className="text-base font-medium">Tin nhắn</span>
          <span className="text-sm font-medium text-gray-500/90">
            Tin nhắn đang chờ
          </span>
        </div>
        <div className="px-6 h-full flex items-center justify-center">
          <p className="text-sm text-gray-500">Không tìm thấy tin nhắn</p>
        </div>
      </div>
    </BasePanel>
  );
}
