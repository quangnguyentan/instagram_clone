"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Copy, Ellipsis, ExternalLink, Send, UserMinus } from "lucide-react";
import { User } from "@/types/user.type";
import defaultUser from "@/assets/images/avatar_default.jpg";
import { useTimeAgo } from "@/hooks/useTimeAgo";
import ReportButton from "./ReportButton";

interface PostHeaderProps {
  user: User;
  createdAt: string;
  postId: string;
  isOwnPost: boolean;
  isFollowing: boolean;
  isBookmarked: boolean;
  onShare: () => void;
  onSave: () => void;
  onUnfollow: () => void;
}

export default function PostHeader({
  user,
  createdAt,
  postId,
  isOwnPost,
  isFollowing,
  isBookmarked,
  onShare,
  onSave,
  onUnfollow,
}: Readonly<PostHeaderProps>) {
  const label = useTimeAgo(createdAt);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyNotice, setCopyNotice] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [menuOpen]);

  const copyPostLink = async () => {
    try {
      const link = new URL(`/p/${postId}`, window.location.origin).toString();
      await navigator.clipboard.writeText(link);
      setCopyNotice("Đã sao chép liên kết");
    } catch {
      setCopyNotice("Không thể sao chép liên kết");
    }
    setMenuOpen(false);
    window.setTimeout(() => setCopyNotice(""), 2500);
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <Image
          src={user.avatarUrl || defaultUser}
          alt={user.username}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
        <Link href={`/profile/${user.username}`} className="truncate font-semibold">
          {user.username}
        </Link>
        <span className="text-gray-400">·</span>
        <span className="shrink-0 text-gray-500">{label}</span>
      </div>

      <div className="relative ml-2" ref={menuRef}>
        <button
          type="button"
          aria-label="Tùy chọn bài viết"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <Ellipsis size={22} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-xl bg-white py-1 text-sm shadow-xl ring-1 ring-black/10">
            {!isOwnPost && (
              <>
                <div
                  className="border-b px-4 py-3 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <ReportButton
                    targetType="post"
                    targetId={postId}
                    className="w-full text-left text-sm font-semibold text-red-600"
                  />
                </div>
                {isFollowing && (
                  <button
                    type="button"
                    onClick={() => {
                      onUnfollow();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 border-b px-4 py-3 text-left hover:bg-gray-50"
                  >
                    <UserMinus size={17} />
                    Bỏ theo dõi
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={() => {
                onSave();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 border-b px-4 py-3 text-left hover:bg-gray-50"
            >
              <Bookmark size={17} />
              {isBookmarked ? "Xóa khỏi mục đã lưu" : "Lưu bài viết"}
            </button>
            <Link
              href={`/p/${postId}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 border-b px-4 py-3 hover:bg-gray-50"
            >
              <ExternalLink size={17} />
              Đi đến bài viết
            </Link>
            <button
              type="button"
              onClick={() => {
                onShare();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 border-b px-4 py-3 text-left hover:bg-gray-50"
            >
              <Send size={17} />
              Chia sẻ lên...
            </button>
            <button
              type="button"
              onClick={() => void copyPostLink()}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50"
            >
              <Copy size={17} />
              Sao chép liên kết
            </button>
          </div>
        )}
        {copyNotice && (
          <span
            role="status"
            className="absolute right-0 top-full z-40 mt-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white"
          >
            {copyNotice}
          </span>
        )}
      </div>
    </div>
  );
}
