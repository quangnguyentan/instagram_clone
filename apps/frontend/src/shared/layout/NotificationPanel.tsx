"use client";
import React from "react";
import BasePanel from "../custom/BasePanel";

interface NotificationPanelProps {
  open: boolean;
  onClose?: () => void;
}

export default function NotificationPanel({
  open,
  onClose,
}: Readonly<NotificationPanelProps>) {
  return (
    <BasePanel open={open} onClose={onClose}>
      <div className="flex flex-col h-full gap-4">
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-semibold pb-8 px-2">Tìm kiếm</h2>
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full border rounded-lg px-3 py-2 text-sm placeholder:text-base focus:outline-none border-none bg-gray-200/60"
          />
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
