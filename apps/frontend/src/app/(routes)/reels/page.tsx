"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Bookmark,
  Ellipsis,
  MessageCircle,
  Pause,
  Play,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { useToggleLike } from "@/hooks/useLike";
import {
  useCreateReelBookmark,
  useDeleteReelBookmark,
  useReelBookmarks,
} from "@/hooks/useBookmarks";
import {
  useCreateReelComment,
  useReelComments,
  useReelsFeed,
} from "@/hooks/useSocial";
import { Reel } from "@/types/social.type";
import ReportButton from "@/shared/layout/ReportButton";
import Image from "next/image";
import defaultUser from "@/assets/images/avatar_default.jpg";

function ReelCard({ reel }: { reel: Reel }) {
  const { user } = useAuthStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const likeMutation = useToggleLike();
  const bookmarksQuery = useReelBookmarks();
  const createBookmark = useCreateReelBookmark();
  const deleteBookmark = useDeleteReelBookmark();
  const initiallyLiked = reel.likes?.includes(user?._id ?? "") ?? false;
  const [liked, setLiked] = useState(initiallyLiked);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [shareNotice, setShareNotice] = useState("");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const {
    data: comments = [],
    isLoading: commentsLoading,
    isError: commentsError,
  } = useReelComments(reel._id, commentsOpen);
  const createComment = useCreateReelComment(reel._id);
  const isBookmarked = bookmarksQuery.data?.includes(reel._id) ?? false;
  const isBookmarkPending =
    createBookmark.isPending || deleteBookmark.isPending;

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

  useEffect(() => {
    const video = videoRef.current;
    const card = video?.closest("article");
    if (!video || !card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          void video.play().then(
            () => setIsPlaying(true),
            () => setIsPlaying(false),
          );
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(
        () => setIsPlaying(true),
        () => setIsPlaying(false),
      );
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleLike = () => {
    if (!user?._id || likeMutation.isPending) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    likeMutation.mutate(
      { targetType: "reel", targetId: reel._id, userId: user._id },
      { onError: () => setLiked(!nextLiked) },
    );
  };

  const shareReel = async () => {
    const url = new URL(`/reels?reel=${reel._id}`, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Reel của @${reel.user.username}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareNotice("Đã sao chép liên kết");
        window.setTimeout(() => setShareNotice(""), 2000);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareNotice("Không thể chia sẻ Reel");
      window.setTimeout(() => setShareNotice(""), 2500);
    }
  };

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text || createComment.isPending) return;
    createComment.mutate(text, {
      onSuccess: () => setCommentText(""),
    });
  };

  const toggleBookmark = () => {
    if (isBookmarkPending || bookmarksQuery.isLoading) return;
    const mutation = isBookmarked ? deleteBookmark : createBookmark;
    mutation.mutate(reel._id, {
      onError: () => setShareNotice("Không thể cập nhật mục đã lưu"),
      onSuccess: () => {
        setShareNotice(isBookmarked ? "Đã bỏ lưu Reel" : "Đã lưu Reel");
        window.setTimeout(() => setShareNotice(""), 2000);
      },
    });
  };

  const likeCount =
    (reel.likes?.length ?? 0) +
    Number(liked) -
    Number(initiallyLiked);

  return (
    <article
      data-reel-id={reel._id}
      className="flex h-[calc(100svh-1rem)] min-h-[480px] snap-center items-end justify-center gap-3 py-3"
    >
      <div className="relative h-full max-h-[900px] w-[min(74vw,430px)] overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          src={reel.mediaUrls[0]}
          className="h-full w-full cursor-pointer object-contain"
          playsInline
          loop
          muted={isMuted}
          autoPlay
          onClick={togglePlayback}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          aria-label="Video Reel"
        />
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label="Phát Reel"
            className="absolute inset-0 flex items-center justify-center bg-black/10 text-white"
          >
            <span className="rounded-full bg-black/40 p-4">
              <Play size={30} fill="currentColor" />
            </span>
          </button>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-4 pb-5 pt-20 text-white">
          <Link
            href={`/profile/${reel.user.username}`}
            onClick={(event) => event.stopPropagation()}
            className="pointer-events-auto inline-flex items-center gap-2 text-sm font-semibold hover:underline"
          >
            <Image
              src={reel.user.avatarUrl || defaultUser}
              alt=""
              width={34}
              height={34}
              className="h-[34px] w-[34px] rounded-full border border-white/70 object-cover"
            />
            @{reel.user.username}
          </Link>
          {reel.caption && (
            <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm">
              {reel.caption}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsMuted((muted) => !muted)}
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          className="absolute bottom-4 right-4 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        {shareNotice && (
          <p
            role="status"
            className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white"
          >
            {shareNotice}
          </p>
        )}
      </div>

      <div className="flex w-12 shrink-0 flex-col items-center gap-5 pb-3 text-gray-800">
        <button
          type="button"
          onClick={toggleLike}
          disabled={likeMutation.isPending}
          className={`flex flex-col items-center gap-1 ${
            liked ? "text-red-500" : "text-gray-800"
          }`}
          aria-label={liked ? "Bỏ thích Reel" : "Thích Reel"}
          aria-pressed={liked}
        >
          <Heart size={25} fill={liked ? "currentColor" : "none"} />
          <span className="text-[11px]">{likeCount}</span>
        </button>
        <button
          type="button"
          onClick={() => setCommentsOpen(true)}
          className="flex flex-col items-center gap-1 hover:text-gray-500"
          aria-label="Mở bình luận Reel"
        >
          <MessageCircle size={24} />
          <span className="text-[11px]">Bình luận</span>
        </button>
        <button
          type="button"
          onClick={() => void shareReel()}
          className="flex flex-col items-center gap-1 hover:text-gray-500"
          aria-label="Chia sẻ Reel"
        >
          <Send size={23} />
          <span className="text-[11px]">Chia sẻ</span>
        </button>
        <button
          type="button"
          onClick={toggleBookmark}
          disabled={isBookmarkPending || bookmarksQuery.isLoading}
          className={`flex flex-col items-center gap-1 disabled:opacity-50 ${
            isBookmarked ? "text-blue-600" : "hover:text-gray-500"
          }`}
          aria-label={isBookmarked ? "Bỏ lưu Reel" : "Lưu Reel"}
          aria-pressed={isBookmarked}
        >
          <Bookmark size={23} fill={isBookmarked ? "currentColor" : "none"} />
          <span className="text-[11px]">
            {isBookmarked ? "Đã lưu" : "Lưu"}
          </span>
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Tùy chọn Reel"
            aria-expanded={menuOpen}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <Ellipsis size={23} />
          </button>
          {menuOpen && (
            <div className="absolute bottom-0 left-full z-30 ml-2 min-w-36 rounded-lg border bg-white p-3 shadow-lg">
              {user?._id !== reel.user._id ? (
                <ReportButton
                  targetType="reel"
                  targetId={reel._id}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                />
              ) : (
                <p className="text-xs text-gray-500">Không có tùy chọn khác</p>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Tạm dừng Reel" : "Phát Reel"}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          {isPlaying ? <Pause size={21} /> : <Play size={21} />}
        </button>
      </div>

      {commentsOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/45 sm:items-center sm:p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCommentsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Bình luận Reel"
            className="flex h-[min(620px,85vh)] w-full max-w-[500px] flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
          >
            <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
              <span className="w-6" />
              <h2 className="text-sm font-semibold">Bình luận</h2>
              <button
                type="button"
                aria-label="Đóng bình luận"
                onClick={() => setCommentsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {commentsLoading ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  Đang tải bình luận...
                </p>
              ) : commentsError ? (
                <p role="alert" className="py-8 text-center text-sm text-red-600">
                  Không tải được bình luận.
                </p>
              ) : comments.length ? (
                <ul className="space-y-5">
                  {comments.map((comment) => (
                    <li key={comment._id} className="flex gap-3">
                      <Image
                        src={comment.user.avatarUrl || defaultUser}
                        alt=""
                        width={34}
                        height={34}
                        className="h-[34px] w-[34px] shrink-0 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1 text-sm">
                        <Link
                          href={`/profile/${comment.user.username}`}
                          className="mr-2 font-semibold hover:underline"
                        >
                          {comment.user.username}
                        </Link>
                        <span className="whitespace-pre-wrap break-words">
                          {comment.content}
                        </span>
                        <time
                          dateTime={comment.createdAt}
                          className="mt-1 block text-xs text-gray-500"
                        >
                          {new Date(comment.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </time>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <MessageCircle size={38} />
                  <p className="mt-3 font-semibold">Chưa có bình luận nào</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Hãy bắt đầu cuộc trò chuyện.
                  </p>
                </div>
              )}
            </div>
            {createComment.isError && (
              <p role="alert" className="px-4 pb-2 text-sm text-red-600">
                Không thể gửi bình luận. Vui lòng thử lại.
              </p>
            )}
            <form
              onSubmit={submitComment}
              className="flex shrink-0 items-center gap-3 border-t px-4 py-3"
            >
              <Image
                src={user?.avatarUrl || defaultUser}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Thêm bình luận..."
                aria-label="Viết bình luận"
                maxLength={1000}
                className="min-w-0 flex-1 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || createComment.isPending}
                className="text-sm font-semibold text-blue-600 disabled:text-blue-300"
              >
                {createComment.isPending ? "Đang gửi..." : "Đăng"}
              </button>
            </form>
          </section>
        </div>
      )}
    </article>
  );
}

export default function Reels() {
  const { data, isLoading, isError } = useReelsFeed();
  const reels = useMemo(() => data?.docs ?? [], [data?.docs]);

  useEffect(() => {
    const requestedReelId = new URLSearchParams(window.location.search).get(
      "reel",
    );
    if (!requestedReelId || !reels.length) return;
    const requestedReel = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reel-id]"),
    ).find((element) => element.dataset.reelId === requestedReelId);
    requestedReel?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [reels]);

  if (isLoading) {
    return <p className="p-8 text-sm text-gray-500">Đang tải Reels...</p>;
  }
  if (isError) {
    return <p className="p-8 text-sm text-red-600">Không tải được Reels.</p>;
  }

  return (
    <section
      aria-label="Reels"
      className="h-full min-h-0 w-full snap-y snap-mandatory overflow-y-auto scroll-smooth"
    >
      {reels.map((reel) => (
        <ReelCard key={reel._id} reel={reel} />
      ))}
      {!reels.length && (
        <p className="p-8 text-center text-sm text-gray-500">
          Chưa có Reel nào.
        </p>
      )}
    </section>
  );
}
