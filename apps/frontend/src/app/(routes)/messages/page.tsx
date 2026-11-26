"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Send, Smile, SquarePen } from "lucide-react";
import {
  useChats,
  useCreateChat,
  useMessages,
  useSendMessage,
  useStoriesFeed,
} from "@/hooks/useSocial";
import { useSearchUsers } from "@/hooks/useUsers";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { useSocket } from "@/providers/SocketProvider";
import { DirectChat } from "@/types/social.type";
import { useQueryClient } from "@tanstack/react-query";
import defaultUser from "@/assets/images/avatar_default.jpg";
import StoryCarousel from "@/shared/layout/StoryCarousel";

function getRecipient(chat: DirectChat, currentUserId?: string) {
  return chat.members.find((member) => member._id !== currentUserId);
}

function formatRelativeTime(value?: string) {
  if (!value) return "";
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return "";
  const elapsedSeconds = Math.max(0, (Date.now() - timestamp) / 1000);
  const units = [
    { name: "year" as const, seconds: 31_536_000 },
    { name: "month" as const, seconds: 2_592_000 },
    { name: "week" as const, seconds: 604_800 },
    { name: "day" as const, seconds: 86_400 },
    { name: "hour" as const, seconds: 3_600 },
    { name: "minute" as const, seconds: 60 },
  ];
  const relativeTime = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });
  const unit = units.find(({ seconds }) => elapsedSeconds >= seconds);
  return unit
    ? relativeTime.format(-Math.floor(elapsedSeconds / unit.seconds), unit.name)
    : "vừa xong";
}

export default function MessagesPage() {
  const { user } = useAuthStore();
  const socket = useSocket();
  const queryClient = useQueryClient();
  const {
    data: chats = [],
    isLoading: chatsLoading,
    isError: chatsError,
  } = useChats();
  const { data: stories = [] } = useStoriesFeed();
  const [activeChatId, setActiveChatId] = useState("");
  const [search, setSearch] = useState("");
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { data: searchResults = [] } = useSearchUsers(search);
  const createChat = useCreateChat();
  const sendMessage = useSendMessage();
  const {
    data: messages = [],
    isLoading: messagesLoading,
    isError: messagesError,
    refetch: refetchMessages,
  } = useMessages(activeChatId);

  const activeChat = useMemo(
    () => chats.find((chat) => chat._id === activeChatId),
    [activeChatId, chats],
  );
  const activeRecipient = activeChat
    ? getRecipient(activeChat, user?._id)
    : undefined;
  const visibleMessages =
    messages.length > 0
      ? messages
      : activeChat?.lastMessage
        ? [activeChat.lastMessage]
        : [];
  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return chats;
    return chats.filter((chat) => {
      const person = getRecipient(chat, user?._id);
      return (
        person?.fullname.toLowerCase().includes(query) ||
        person?.username.toLowerCase().includes(query)
      );
    });
  }, [chats, search, user?._id]);

  useEffect(() => {
    if (!chats.length) return;
    const requestedChatId = new URLSearchParams(window.location.search).get(
      "chatId",
    );
    if (requestedChatId && chats.some((chat) => chat._id === requestedChatId)) {
      if (activeChatId !== requestedChatId) setActiveChatId(requestedChatId);
    } else if (!activeChatId) {
      setActiveChatId(chats[0]._id);
    }
  }, [activeChatId, chats]);

  useEffect(() => {
    if (!activeChatId) return;
    socket.emit("join_chat", activeChatId);
    const handleMessage = (message: { chatId: string }) => {
      if (message.chatId === activeChatId) {
        queryClient.invalidateQueries({ queryKey: ["messages", activeChatId] });
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    };
    socket.on("receive_message", handleMessage);
    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [activeChatId, queryClient, socket]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChatId, messages]);

  const startChat = async (userId: string) => {
    setNotice("");
    try {
      const chat = await createChat.mutateAsync(userId);
      setActiveChatId(chat._id);
      setSearch("");
    } catch {
      setNotice("Không thể bắt đầu cuộc trò chuyện.");
    }
  };

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = content.trim();
    if (!message || !activeChatId) return;
    setNotice("");
    sendMessage.mutate(
      { chatId: activeChatId, content: message },
      {
        onSuccess: () => setContent(""),
        onError: () => setNotice("Không thể gửi tin nhắn. Vui lòng thử lại."),
      },
    );
  };

  return (
    <main className="flex h-[calc(100vh-1rem)] min-h-[480px] w-full overflow-hidden border bg-white">
      <aside className="flex w-[min(100%,390px)] shrink-0 flex-col border-r">
        <header className="flex h-[60px] shrink-0 items-center justify-between px-5">
          <h1 className="text-base font-semibold">
            {user?.username ?? "Tin nhắn"}
          </h1>
          <button
            type="button"
            aria-label="Bắt đầu tin nhắn mới"
            title="Tin nhắn mới"
            onClick={() => {
              setActiveChatId("");
              setSearch("");
            }}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <SquarePen size={20} />
          </button>
        </header>

        <label className="mx-4 mb-4 flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
          <Search size={17} className="shrink-0 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm"
            aria-label="Tìm người dùng hoặc cuộc trò chuyện"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>

        {stories.length > 0 && (
          <div className="shrink-0 border-b pb-2">
            <StoryCarousel stories={stories} />
          </div>
        )}

        {search.trim() && searchResults.length > 0 && (
          <div className="mx-3 mb-2 max-h-48 shrink-0 overflow-y-auto rounded-lg border bg-white shadow-sm">
            {searchResults
              .filter((person) => person._id !== user?._id)
              .map((person) => (
                <button
                  type="button"
                  key={person._id}
                  onClick={() => void startChat(person._id)}
                  disabled={createChat.isPending}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 disabled:opacity-50"
                >
                  <Image
                    src={person.avatarUrl || defaultUser}
                    alt=""
                    width={38}
                    height={38}
                    className="h-[38px] w-[38px] rounded-full object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {person.fullname}
                    </span>
                    <span className="block truncate text-xs text-gray-500">
                      @{person.username}
                    </span>
                  </span>
                </button>
              ))}
          </div>
        )}

        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-sm font-semibold">Tin nhắn</h2>
          <span className="text-xs font-medium text-gray-500">
            Tin nhắn đang chờ
          </span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {chatsLoading ? (
            <p className="p-5 text-sm text-gray-500">
              Đang tải cuộc trò chuyện...
            </p>
          ) : chatsError ? (
            <p role="alert" className="p-5 text-sm text-red-600">
              Không tải được danh sách tin nhắn.
            </p>
          ) : filteredChats.length ? (
            <ul>
              {filteredChats.map((chat) => {
                const person = getRecipient(chat, user?._id);
                if (!person) return null;
                return (
                  <li key={chat._id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveChatId(chat._id);
                        setNotice("");
                      }}
                      className={`flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 ${chat._id === activeChatId ? "bg-gray-100" : ""
                        }`}
                    >
                      <Image
                        src={person.avatarUrl || defaultUser}
                        alt=""
                        width={52}
                        height={52}
                        className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">
                          {person.fullname}
                        </span>
                        <span className="block truncate text-xs text-gray-500">
                          {chat.lastMessage?.content || "Bắt đầu trò chuyện"}
                          {chat.lastMessage?.createdAt && (
                            <>
                              {" · "}
                              {formatRelativeTime(chat.lastMessage.createdAt)}
                            </>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              {search ? "Không tìm thấy người dùng hoặc cuộc trò chuyện." : "Chưa có tin nhắn."}
            </p>
          )}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        {activeChat && activeRecipient ? (
          <>
            <header className="flex h-[60px] shrink-0 items-center justify-between border-b px-5">
              <Link
                href={`/profile/${activeRecipient.username}`}
                className="flex min-w-0 items-center gap-3"
              >
                <Image
                  src={activeRecipient.avatarUrl || defaultUser}
                  alt=""
                  width={38}
                  height={38}
                  className="h-[38px] w-[38px] rounded-full object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {activeRecipient.fullname}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {activeRecipient.username}
                  </span>
                </span>
              </Link>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
              {messagesLoading ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  Đang tải tin nhắn...
                </p>
              ) : messagesError ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p role="alert" className="text-sm text-red-600">
                    Không tải được nội dung cuộc trò chuyện.
                  </p>
                  <button
                    type="button"
                    onClick={() => void refetchMessages()}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Thử tải lại
                  </button>
                </div>
              ) : visibleMessages.length ? (
                <div className="mx-auto flex flex-col gap-4">
                  {visibleMessages.map((message) => {
                    const isMine = message.sender._id === user?._id;
                    return (
                      <div
                        key={message._id}
                        className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"
                          }`}
                      >
                        {!isMine && (
                          <Image
                            src={message.sender.avatarUrl || defaultUser}
                            alt=""
                            width={26}
                            height={26}
                            className="h-[26px] w-[26px] shrink-0 rounded-full object-cover"
                          />
                        )}
                        <div
                          className={`flex max-w-[min(78%,520px)] flex-col ${isMine ? "items-end" : "items-start"
                            }`}
                        >
                          {message.content && (
                            <p
                              className={`whitespace-pre-wrap break-words rounded-3xl px-4 py-2.5 text-sm ${isMine
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-900"
                                }`}
                            >
                              {message.content}
                            </p>
                          )}
                          {message.mediaUrl && (
                            <Link
                              href={message.mediaUrl}
                              className="mt-1 rounded-xl border bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50"
                            >
                              {message.mediaUrl.startsWith("/p/")
                                ? "Xem bài viết được chia sẻ"
                                : "Xem tệp được gửi"}
                            </Link>
                          )}
                          <time
                            dateTime={message.createdAt}
                            className="mt-1 px-2 text-[10px] text-gray-400"
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </time>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endOfMessagesRef} />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <Image
                    src={activeRecipient.avatarUrl || defaultUser}
                    alt=""
                    width={88}
                    height={88}
                    className="h-[88px] w-[88px] rounded-full object-cover"
                  />
                  <p className="mt-4 text-base font-semibold">
                    {activeRecipient.fullname}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    @{activeRecipient.username}
                  </p>
                  <p className="mt-3 text-sm text-gray-500">
                    Hãy gửi tin nhắn để bắt đầu cuộc trò chuyện.
                  </p>
                </div>
              )}
            </div>

            {notice && (
              <p role="alert" className="px-5 pb-2 text-sm text-red-600">
                {notice}
              </p>
            )}
            <form
              onSubmit={submitMessage}
              className="m-4 flex shrink-0 items-center gap-3 rounded-full border px-4 py-2"
            >
              <button
                type="button"
                aria-label="Chèn biểu tượng cảm xúc"
                onClick={() => setContent((value) => `${value}🙂`)}
                className="shrink-0 text-gray-700"
              >
                <Smile size={22} />
              </button>
              <input
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Nhắn tin..."
                aria-label="Nội dung tin nhắn"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              {content.trim() && (
                <button
                  type="submit"
                  disabled={sendMessage.isPending}
                  aria-label="Gửi tin nhắn"
                  className="shrink-0 text-blue-600 disabled:text-gray-400"
                >
                  <Send size={20} />
                </button>
              )}
            </form>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-black">
              <Send size={28} />
            </div>
            <h2 className="text-xl font-light">Tin nhắn của bạn</h2>
            <p className="text-sm text-gray-500">
              Gửi ảnh và tin nhắn riêng cho bạn bè.
            </p>
            {notice && (
              <p role="alert" className="text-sm text-red-600">
                {notice}
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
