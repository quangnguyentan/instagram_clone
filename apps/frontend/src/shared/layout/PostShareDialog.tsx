"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Link2, Search, Send, X } from "lucide-react";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { useSearchUsers, useSuggestions } from "@/hooks/useUsers";
import { useCreateChat, useSendMessage } from "@/hooks/useSocial";
import defaultUser from "@/assets/images/avatar_default.jpg";
import { Post } from "@/types/post.type";
import { User } from "@/types/user.type";

interface PostShareDialogProps {
  post: Post;
  open: boolean;
  onClose: () => void;
}

export default function PostShareDialog({
  post,
  open,
  onClose,
}: Readonly<PostShareDialogProps>) {
  const currentUser = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const { data: suggestions = [] } = useSuggestions(open);
  const { data: searchResults = [] } = useSearchUsers(search, open);
  const createChat = useCreateChat();
  const sendMessage = useSendMessage();
  const isSending = createChat.isPending || sendMessage.isPending;

  if (!open) return null;

  const users = (search.trim() ? searchResults : suggestions).filter(
    (person) => person._id !== currentUser?._id,
  );
  const postPath = `/p/${post._id}`;

  const toggleUser = (person: User) => {
    setNotice("");
    setError("");
    setSelectedUsers((current) =>
      current.some((selected) => selected._id === person._id)
        ? current.filter((selected) => selected._id !== person._id)
        : [...current, person],
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(postPath, window.location.origin).toString(),
      );
      setError("");
      setNotice("Đã sao chép liên kết.");
    } catch {
      setNotice("");
      setError("Không thể sao chép liên kết trên trình duyệt này.");
    }
  };

  const sharePost = async () => {
    setNotice("");
    setError("");
    let sentCount = 0;
    try {
      for (const recipient of selectedUsers) {
        const chat = await createChat.mutateAsync(recipient._id);
        await sendMessage.mutateAsync({
          chatId: chat._id,
          content: `Đã chia sẻ bài viết của @${post.user.username}`,
          mediaUrl: postPath,
        });
        sentCount += 1;
      }
      setSelectedUsers([]);
      setNotice(`Đã chia sẻ bài viết với ${sentCount} người.`);
    } catch {
      setError(
        sentCount
          ? `Đã gửi cho ${sentCount} người, nhưng không gửi được cho tất cả.`
          : "Không thể chia sẻ bài viết. Vui lòng thử lại.",
      );
    }
  };

  const shareWithDevice = async () => {
    const url = new URL(postPath, window.location.origin).toString();
    if (!navigator.share) {
      await copyLink();
      return;
    }
    try {
      await navigator.share({
        title: `Bài viết của @${post.user.username}`,
        url,
      });
    } catch (shareError) {
      if (shareError instanceof DOMException && shareError.name === "AbortError") {
        return;
      }
      setError("Không thể mở bảng chia sẻ của thiết bị.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-post-title"
        className="flex h-[min(720px,92vh)] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white"
      >
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
          <button type="button" onClick={onClose} aria-label="Đóng chia sẻ">
            <X size={22} />
          </button>
          <h2 id="share-post-title" className="text-base font-semibold">
            Chia sẻ
          </h2>
          <button
            type="button"
            onClick={() => void sharePost()}
            disabled={!selectedUsers.length || isSending}
            className="font-semibold text-blue-600 disabled:text-gray-300"
          >
            {isSending ? "Đang gửi..." : "Gửi"}
          </button>
        </header>

        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search size={18} className="shrink-0 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm"
            aria-label="Tìm người nhận"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          {selectedUsers.length > 0 && (
            <span className="text-xs text-gray-500">
              Đã chọn {selectedUsers.length}
            </span>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <h3 className="mb-4 text-sm font-semibold">Gợi ý</h3>
          {users.length ? (
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4">
              {users.map((person) => {
                const isSelected = selectedUsers.some(
                  (selected) => selected._id === person._id,
                );
                return (
                  <button
                    type="button"
                    key={person._id}
                    onClick={() => toggleUser(person)}
                    aria-pressed={isSelected}
                    className="flex min-w-0 flex-col items-center gap-2"
                  >
                    <span className="relative">
                      <Image
                        src={person.avatarUrl || defaultUser}
                        alt=""
                        width={64}
                        height={64}
                        className={`h-16 w-16 rounded-full object-cover ${
                          isSelected ? "ring-2 ring-blue-600 ring-offset-2" : ""
                        }`}
                      />
                      {isSelected && (
                        <span className="absolute -right-1 -top-1 rounded-full bg-blue-600 p-1 text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </span>
                    <span className="w-full truncate text-center text-xs">
                      {person.username}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">
              {search.trim() ? "Không tìm thấy người dùng." : "Chưa có gợi ý."}
            </p>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t p-4">
          <button
            type="button"
            onClick={() => void copyLink()}
            className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
          >
            <Link2 size={17} />
            Sao chép liên kết
          </button>
          <button
            type="button"
            onClick={() => void shareWithDevice()}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Send size={16} />
            Chia sẻ
          </button>
          {(notice || error) && (
            <p
              role="status"
              className={`absolute bottom-20 left-1/2 -translate-x-1/2 rounded-lg bg-white px-3 py-2 text-sm shadow ${
                error ? "text-red-600" : "text-green-700"
              }`}
            >
              {error || notice}
            </p>
          )}
        </footer>
      </section>
    </div>
  );
}
