"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import BasePanel from "../custom/BasePanel";
import { CloseIcon, LoaderIcon } from "../ui/Icon";
import { useSearchPosts } from "@/hooks/usePosts";
import { useSearchUsers } from "@/hooks/useUsers";

interface SearchPanelProps {
  open: boolean;
  onClose?: () => void;
}

export default function SearchPanel({
  open,
  onClose,
}: Readonly<SearchPanelProps>) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const usersQuery = useSearchUsers(query);
  const postsQuery = useSearchPosts(query);
  const isLoading = query.length > 0 && (usersQuery.isFetching || postsQuery.isFetching);
  const posts = postsQuery.data?.docs ?? [];

  const clearSearch = () => {
    setSearch("");
    setQuery("");
  };

  return (
    <BasePanel open={open} onClose={onClose}>
      <div className="flex h-full flex-col gap-4">
        <div className="px-4 pt-6">
          <h2 className="px-2 pb-8 text-2xl font-semibold">Tìm kiếm</h2>
          <div className="relative">
            <input
              type="search"
              value={search}
              placeholder="Tìm tài khoản hoặc bài viết"
              className="w-full rounded-lg border-none bg-gray-200/60 px-3 py-3 text-sm focus:outline-none"
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isLoading ? (
                <LoaderIcon className="h-4 w-4 animate-spin text-gray-500" />
              ) : search ? (
                <button type="button" aria-label="Xóa tìm kiếm" onClick={clearSearch}>
                  <CloseIcon className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-gray-200" />
        {!query ? (
          <div className="flex h-full items-center justify-center px-6 text-sm text-gray-500">
            Tìm tài khoản hoặc bài viết theo nội dung.
          </div>
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center">
            <LoaderIcon className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="flex flex-col gap-5 overflow-y-auto px-5 pb-6">
            <section>
              <h3 className="mb-3 text-sm font-semibold">Tài khoản</h3>
              {(usersQuery.data ?? []).map((user) => (
                <Link
                  key={user._id}
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-md py-2 hover:bg-gray-50"
                >
                  <img
                    src={user.avatarUrl || "/default-avatar.png"}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{user.username}</p>
                    <p className="truncate text-xs text-gray-500">{user.fullname}</p>
                  </div>
                </Link>
              ))}
              {usersQuery.data?.length === 0 && (
                <p className="text-sm text-gray-500">Không tìm thấy tài khoản.</p>
              )}
            </section>
            <section>
              <h3 className="mb-3 text-sm font-semibold">Bài viết</h3>
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => {
                  const media = post.media?.[0];
                  if (!media) return null;
                  return (
                    <Link
                      key={post._id}
                      href={`/profile/${post.user.username}`}
                      onClick={onClose}
                      className="aspect-square overflow-hidden bg-gray-100"
                    >
                      {media.mediaType === "video" ? (
                        <video src={media.url} className="h-full w-full object-cover" muted />
                      ) : (
                        <img src={media.url} alt={post.caption ?? ""} className="h-full w-full object-cover" />
                      )}
                    </Link>
                  );
                })}
              </div>
              {posts.length === 0 && (
                <p className="text-sm text-gray-500">Không tìm thấy bài viết.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </BasePanel>
  );
}
