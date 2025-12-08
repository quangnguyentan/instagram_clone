import React from "react";
import { MessageCircleIcon } from "@/shared/ui/Icon";
import BaseButton from "@/shared/custom/BaseButton";

const MessageButton = () => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-center gap-2">
      <MessageCircleIcon className="w-28 h-28" strokeWidth={0.5} />

      <p className="text-lg font-medium">Tin nhắn của bạn</p>
      <p className="text-sm text-gray-500/90">
        Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm
      </p>
      <BaseButton
        type="primary"
        className="px-4! py-1! bg-[#4A5DF9]! hover:bg-[#4A5DF9]/90!"
        handleClick={() => {}}
      >
        Gửi tin nhắn
      </BaseButton>
    </div>
  );
};

export default MessageButton;
