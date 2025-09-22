"use client";
import React, { useState } from "react";
import BasePanel from "../custom/BasePanel";
import { CloseIcon, LoaderIcon } from "../ui/Icon";

interface SearchPanelProps {
  open: boolean;
  onClose?: () => void;
}

export default function SearchPanel({
  open,
  onClose,
}: Readonly<SearchPanelProps>) {
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
    <BasePanel open={open} onClose={onClose}>
      <div className="flex flex-col h-full gap-4">
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-semibold pb-8 px-2">Tìm kiếm</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="w-full border rounded-lg px-3 py-3 text-sm placeholder:text-base focus:outline-none border-none bg-gray-200/60"
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
        <div className="w-full h-[1.5px] bg-gray-200"></div>
        <h3 className="text-base font-medium px-6">Mới đây</h3>
        <div className="px-6 h-full flex items-center justify-center">
          <p className="text-sm text-gray-500">
            Không có nội dung tìm kiếm mới đây.
          </p>
        </div>
      </div>
    </BasePanel>
  );
}
