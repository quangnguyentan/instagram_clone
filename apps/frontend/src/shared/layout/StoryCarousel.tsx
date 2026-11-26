"use client";

import React, { FormEvent, useMemo, useState } from "react";
import Stories from "react-insta-stories";
import { Story } from "@/types/social.type";
import {
  useCreateChat,
  useMarkStoryViewed,
  useSendMessage,
} from "@/hooks/useSocial";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Pause,
  Play,
  Send,
  X,
} from "lucide-react";
import Link from "next/link";
import defaultUser from "@/assets/images/avatar_default.jpg";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { useToggleLike } from "@/hooks/useLike";

interface StoryCarouselProps {
  stories: Story[];
}

export default function StoryCarousel({
  stories,
}: Readonly<StoryCarouselProps>) {
  const [activeStories, setActiveStories] = useState<Story[] | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reply, setReply] = useState("");
  const [notice, setNotice] = useState("");
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const markViewed = useMarkStoryViewed();
  const toggleLike = useToggleLike();
  const createChat = useCreateChat();
  const sendMessage = useSendMessage();
  const currentUserId = useAuthStore((state) => state.user?._id);
  const activeStory = activeStories?.[activeStoryIndex];
  const isLiked = activeStory
    ? likedStories[activeStory._id] ??
      activeStory.likes?.includes(currentUserId ?? "") ??
      false
    : false;

  React.useEffect(() => {
    if (!activeStories) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setActiveStories(null);
      setActiveStoryIndex(0);
      setIsPaused(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [activeStories]);

  const storyGroups = useMemo(() => {
    const groupsByUser = new Map<string, Story[]>();
    stories.forEach((story) => {
      const userStories = groupsByUser.get(story.user._id) ?? [];
      userStories.push(story);
      groupsByUser.set(story.user._id, userStories);
    });

    return Array.from(groupsByUser.values())
      .map((userStories) =>
        userStories.sort(
          (left, right) =>
            Date.parse(left.createdAt) - Date.parse(right.createdAt),
        ),
      )
      .sort((left, right) => {
        const leftIsCurrentUser = left[0].user._id === currentUserId;
        const rightIsCurrentUser = right[0].user._id === currentUserId;
        if (leftIsCurrentUser !== rightIsCurrentUser) {
          return leftIsCurrentUser ? -1 : 1;
        }

        return (
          Date.parse(right[right.length - 1].createdAt) -
          Date.parse(left[left.length - 1].createdAt)
        );
      });
  }, [stories, currentUserId]);

  const mapToInstaStories = (userStories: Story[]) =>
    userStories.map((story) => ({
      url: story.mediaUrl,
      type: story.mediaType === "video" ? "video" : "image",
      duration: story.mediaType === "video" ? undefined : 5000,
    }));

  const closeStories = () => {
    setActiveStories(null);
    setActiveStoryIndex(0);
    setIsPaused(false);
    setReply("");
    setNotice("");
  };

  const handleLike = () => {
    if (!activeStory || !currentUserId || toggleLike.isPending) return;
    const nextLiked = !isLiked;
    setLikedStories((current) => ({
      ...current,
      [activeStory._id]: nextLiked,
    }));
    toggleLike.mutate(
      {
        targetType: "story",
        targetId: activeStory._id,
        userId: currentUserId,
      },
      {
        onError: () => {
          setLikedStories((current) => ({
            ...current,
            [activeStory._id]: !nextLiked,
          }));
          setNotice("Không thể thích tin này. Vui lòng thử lại.");
        },
      },
    );
  };

  const handleShare = async () => {
    if (!activeStory) return;
    const url = new URL(activeStory.mediaUrl, window.location.origin).toString();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Tin của @${activeStory.user.username}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setNotice("Đã sao chép liên kết tin.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("Không thể chia sẻ tin này.");
    }
  };

  const handleReply = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = reply.trim();
    if (
      !activeStory ||
      !currentUserId ||
      activeStory.user._id === currentUserId ||
      !message ||
      createChat.isPending ||
      sendMessage.isPending
    ) {
      return;
    }

    setNotice("");
    try {
      const chat = await createChat.mutateAsync(activeStory.user._id);
      await sendMessage.mutateAsync({ chatId: chat._id, content: message });
      setReply("");
      setNotice("Đã gửi phản hồi.");
    } catch {
      setNotice("Không thể gửi phản hồi. Vui lòng thử lại.");
    }
  };

  if (activeStories) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <Stories
          stories={mapToInstaStories(activeStories)}
          currentIndex={activeStoryIndex}
          defaultInterval={5000}
          width="min(420px, 94vw)"
          height="90vh"
          isPaused={isPaused}
          keyboardNavigation
          preventDefault
          onStoryStart={(index: number) => {
            setActiveStoryIndex(index);
            const story = activeStories[index];
            if (story) markViewed.mutate(story._id);
          }}
          onAllStoriesEnd={closeStories}
        />
        {activeStory && (
          <div
            className="pointer-events-none absolute left-1/2 top-[5vh] z-20 h-[90vh] w-[min(420px,94vw)] -translate-x-1/2"
          >
            <header className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 pb-8 pt-7 text-white">
              <Link
                href={`/profile/${activeStory.user.username}`}
                className="flex min-w-0 items-center gap-2"
              >
                <Image
                  src={activeStory.user.avatarUrl || defaultUser}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <span className="truncate text-sm font-semibold">
                  {activeStory.user.fullname || activeStory.user.username}
                </span>
                <span className="shrink-0 text-xs text-white/75">
                  {new Date(activeStory.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </Link>
              <button
                type="button"
                aria-label={isPaused ? "Phát tin" : "Tạm dừng tin"}
                onClick={() => setIsPaused((paused) => !paused)}
                className="rounded-full p-2 hover:bg-black/30"
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>
            </header>

            <div className="pointer-events-auto absolute inset-x-4 bottom-3 flex items-center gap-3">
              <form
                onSubmit={handleReply}
                className="flex min-w-0 flex-1 items-center rounded-full border border-white/80 px-3 py-2 text-white"
              >
                <input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  onFocus={() => setIsPaused(true)}
                  placeholder={`Trả lời ${activeStory.user.username}...`}
                  aria-label={`Trả lời tin của ${activeStory.user.username}`}
                  disabled={activeStory.user._id === currentUserId}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/80 disabled:cursor-not-allowed"
                />
                {reply.trim() && (
                  <button
                    type="submit"
                    aria-label="Gửi phản hồi"
                    disabled={createChat.isPending || sendMessage.isPending}
                    className="ml-2 disabled:opacity-50"
                  >
                    <Send size={19} />
                  </button>
                )}
              </form>
              <button
                type="button"
                aria-label={isLiked ? "Bỏ thích tin" : "Thích tin"}
                aria-pressed={isLiked}
                onClick={handleLike}
                className={isLiked ? "text-red-500" : "text-white"}
              >
                <Heart size={25} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                aria-label="Chia sẻ tin"
                onClick={() => void handleShare()}
                className="text-white"
              >
                <Send size={23} />
              </button>
            </div>
            {notice && (
              <p
                role="status"
                className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white"
              >
                {notice}
              </p>
            )}
          </div>
        )}
        {activeStories.length > 1 && (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 justify-between"
            style={{ width: "min(460px, calc(100vw - 24px))" }}
          >
            <button
              type="button"
              aria-label="Tin trước"
              disabled={activeStoryIndex === 0}
              onClick={() =>
                setActiveStoryIndex((index) => Math.max(0, index - 1))
              }
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-40"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              type="button"
              aria-label="Tin tiếp theo"
              onClick={() => {
                if (activeStoryIndex === activeStories.length - 1) {
                  closeStories();
                } else {
                  setActiveStoryIndex((index) => index + 1);
                }
              }}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
        <button
          className="absolute right-4 top-4 z-30 text-white"
          onClick={closeStories}
          aria-label="Đóng tin"
        >
          <X size={25} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full py-2 max-w-[600px] mx-auto">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2">
        {storyGroups.map((userStories) => {
          const user = userStories[0].user;
          return (
            <button
              key={user._id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setActiveStoryIndex(0);
                setActiveStories(userStories);
                setIsPaused(false);
                setNotice("");
              }}
              aria-label={`Xem tin của ${user.fullname}`}
            >
              <div className="w-16 h-16 rounded-full border-2 border-pink-500 overflow-hidden flex-shrink-0">
                <Image
                  src={user.avatarUrl || defaultUser}
                  alt={user.fullname}
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                  priority
                />
              </div>
              <span className="text-xs mt-1 truncate max-w-[64px] text-center">
                {user._id === currentUserId ? "Tin của bạn" : user.fullname}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
