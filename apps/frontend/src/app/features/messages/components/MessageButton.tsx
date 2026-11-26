"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Maximize2,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import {
  useChats,
  useMessages,
  useSendMessage,
} from "@/hooks/useSocial";
import defaultUser from "@/assets/images/avatar_default.jpg";

export default function MessageButton() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedChatId, setSelectedChatId] = useState("");
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { data: chats = [], isLoading, isError } = useChats(pathname !== "/messages");
  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
  } = useMessages(selectedChatId);
  const sendMessage = useSendMessage();
  const selectedChat = chats.find((chat) => chat._id === selectedChatId);
  const recipient = selectedChat?.members.find(
    (member) => member._id !== user?._id,
  );
  const visibleMessages =
    messages.length > 0
      ? messages
      : selectedChat?.lastMessage
        ? [selectedChat.lastMessage]
        : [];

  useEffect(() => {
    if (open && selectedChatId) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, selectedChatId, messages]);

  const conversations = useMemo(
    () =>
      chats.filter((chat) => {
        const recipient = chat.members.find(
          (member) => member._id !== user?._id,
        );
        const query = search.trim().toLowerCase();
        return (
          !query ||
          recipient?.fullname.toLowerCase().includes(query) ||
          recipient?.username.toLowerCase().includes(query)
        );
      }),
    [chats, search, user?._id],
  );
  const previewPeople = Array.from(
    new Map(
      chats
        .flatMap((chat) => chat.members)
        .filter((member) => member._id !== user?._id)
        .map((member) => [member._id, member]),
    ).values(),
  ).slice(0, 3);

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = content.trim();
    if (!message || !selectedChatId) return;
    setNotice("");
    sendMessage.mutate(
      { chatId: selectedChatId, content: message },
      {
        onSuccess: () => setContent(""),
        onError: () => setNotice("Không thể gửi tin nhắn. Vui lòng thử lại."),
      },
    );
  };

  if (pathname === "/messages") return null;

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <section
          aria-label="Tin nhắn"
          className="absolute bottom-16 right-0 flex h-[min(480px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl"
        >
          <header className="flex h-14 shrink-0 items-center justify-between border-b px-3">
            <div className="flex min-w-0 items-center gap-2">
              {selectedChat && recipient ? (
                <>
                  <button
                    type="button"
                    aria-label="Quay lại danh sách tin nhắn"
                    onClick={() => {
                      setSelectedChatId("");
                      setNotice("");
                    }}
                    className="rounded-full p-1.5 hover:bg-gray-100"
                  >
                    <ArrowLeft size={19} />
                  </button>
                  <Link
                    href={`/profile/${recipient.username}`}
                    onClick={() => setOpen(false)}
                    className="flex min-w-0 items-center gap-2"
                  >
                    <Image
                      src={recipient.avatarUrl || defaultUser}
                      alt=""
                      width={30}
                      height={30}
                      className="h-[30px] w-[30px] shrink-0 rounded-full object-cover"
                    />
                    <span className="truncate text-sm font-semibold">
                      {recipient.fullname}
                    </span>
                  </Link>
                </>
              ) : (
                <h2 className="text-base font-semibold">Tin nhắn</h2>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Link
                href={
                  selectedChatId
                    ? `/messages?chatId=${encodeURIComponent(selectedChatId)}`
                    : "/messages"
                }
                aria-label="Phóng to tin nhắn"
                title="Mở toàn màn hình"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <Maximize2 size={18} />
              </Link>
              <button
                type="button"
                aria-label="Đóng tin nhắn"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={19} />
              </button>
            </div>
          </header>

          {selectedChat && recipient ? (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                <div className="flex min-h-full flex-col justify-end gap-2">
                  {messagesLoading ? (
                    <p className="text-center text-xs text-gray-500">
                      Đang tải tin nhắn...
                    </p>
                  ) : messagesError ? (
                    <p role="alert" className="text-center text-xs text-red-600">
                      Không tải được tin nhắn.
                    </p>
                  ) : visibleMessages.length ? (
                    visibleMessages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex items-end gap-2 ${
                          message.sender._id === user?._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        {message.sender._id !== user?._id && (
                          <Image
                            src={message.sender.avatarUrl || defaultUser}
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 shrink-0 rounded-full object-cover"
                          />
                        )}
                        <div
                          className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                            message.sender._id === user?._id
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.content}
                          {message.mediaUrl && (
                            <Link
                              href={message.mediaUrl}
                              onClick={() => setOpen(false)}
                              className="mt-1 block font-semibold underline"
                            >
                              {message.mediaUrl.startsWith("/p/")
                                ? "Xem bài viết được chia sẻ"
                                : "Xem tệp được gửi"}
                            </Link>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-gray-500">
                      Bạn đã bắt đầu đoạn chat này.
                    </p>
                  )}
                  <div ref={endOfMessagesRef} />
                </div>
              </div>
              {notice && (
                <p role="alert" className="px-3 pb-1 text-xs text-red-600">
                  {notice}
                </p>
              )}
              <form
                onSubmit={submitMessage}
                className="m-3 flex shrink-0 items-center gap-2 rounded-full border px-3 py-2"
              >
                <button
                  type="button"
                  aria-label="Chèn biểu tượng cảm xúc"
                  onClick={() => setContent((value) => `${value}🙂`)}
                  className="shrink-0 text-gray-700"
                >
                  <Smile size={20} />
                </button>
                <input
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Nhắn tin..."
                  aria-label="Nội dung tin nhắn"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={!content.trim() || sendMessage.isPending}
                  aria-label="Gửi tin nhắn"
                  className="shrink-0 text-blue-600 disabled:text-gray-400"
                >
                  <Send size={19} />
                </button>
              </form>
            </>
          ) : (
            <>
              <label className="mx-3 my-3 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                <Search size={17} className="shrink-0 text-gray-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Tìm kiếm"
                  aria-label="Tìm hội thoại"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                />
              </label>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {isLoading ? (
                  <p className="p-5 text-center text-sm text-gray-500">
                    Đang tải tin nhắn...
                  </p>
                ) : isError ? (
                  <p role="alert" className="p-5 text-center text-sm text-red-600">
                    Không tải được tin nhắn.
                  </p>
                ) : conversations.length ? (
                  <ul>
                    {conversations.map((chat) => {
                      const person = chat.members.find(
                        (member) => member._id !== user?._id,
                      );
                      if (!person) return null;
                      return (
                        <li key={chat._id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedChatId(chat._id);
                              setNotice("");
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
                          >
                            <Image
                              src={person.avatarUrl || defaultUser}
                              alt=""
                              width={48}
                              height={48}
                              className="h-12 w-12 shrink-0 rounded-full object-cover"
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">
                                {person.fullname}
                              </span>
                              <span className="block truncate text-xs text-gray-500">
                                {chat.lastMessage?.content || "Bắt đầu trò chuyện"}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="p-5 text-center text-sm text-gray-500">
                    {search ? "Không tìm thấy hội thoại." : "Chưa có tin nhắn."}
                  </p>
                )}
              </div>

              <Link
                href="/messages"
                onClick={() => setOpen(false)}
                className="border-t p-3 text-center text-sm font-semibold text-blue-600 hover:bg-gray-50"
              >
                Gửi tin nhắn
              </Link>
            </>
          )}
        </section>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Đóng tin nhắn" : "Mở tin nhắn"}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-full border border-gray-100 bg-white px-4 py-3 shadow-lg transition hover:shadow-xl"
      >
        <Send size={20} className="shrink-0" />
        <span className="text-sm font-semibold">Tin nhắn</span>
        {previewPeople.length > 0 && (
          <span className="flex items-center -space-x-2">
            {previewPeople.map((person) => (
              <Image
                key={person._id}
                src={person.avatarUrl || defaultUser}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full border-2 border-white object-cover"
              />
            ))}
          </span>
        )}
      </button>
    </div>
  );
}
