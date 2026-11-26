"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import {
  Bookmark,
  Camera,
  Clapperboard,
  Grid3X3,
  Heart,
  MessageCircle,
  Plus,
  Tag,
} from "lucide-react";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { useBookmarks } from "@/hooks/useBookmarks";
import { usePostsByUser } from "@/hooks/usePosts";
import { useReelsByUser } from "@/hooks/useSocial";
import {
  useUpdateOwnProfile,
  useUserByUsername,
  useUserProfile,
} from "@/hooks/useUsers";
import FollowButton from "@/shared/layout/FollowButton";
import ReportButton from "@/shared/layout/ReportButton";
import defaultUser from "@/assets/images/avatar_default.jpg";
import { Post } from "@/types/post.type";
import { Reel } from "@/types/social.type";

type ProfileTab = "posts" | "saved" | "reels" | "tagged";

function EmptyGrid({
  isOwnProfile,
  tab,
}: {
  isOwnProfile: boolean;
  tab: ProfileTab;
}) {
  if (isOwnProfile && tab === "posts") {
    return (
      <div className="col-span-full flex flex-col items-center px-4 py-16 text-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black">
          <Camera size={34} strokeWidth={1.5} />
        </span>
        <h2 className="mb-3 text-3xl font-semibold">Chia sẻ ảnh</h2>
        <p className="mb-4 text-sm">
          Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.
        </p>
        <Link href="/create" className="text-sm font-semibold text-blue-600">
          Chia sẻ ảnh đầu tiên của bạn
        </Link>
      </div>
    );
  }

  const labels: Record<ProfileTab, string> = {
    posts: "Chưa có bài viết.",
    saved: "Bạn chưa lưu bài viết nào.",
    reels: "Chưa có reel nào.",
    tagged: "Chưa có ảnh hoặc video nào được gắn thẻ.",
  };
  return (
    <p className="col-span-full py-16 text-center text-sm text-gray-500">
      {labels[tab]}
    </p>
  );
}

function PostsGrid({
  posts,
  isOwnProfile,
  tab,
}: {
  posts: Post[];
  isOwnProfile: boolean;
  tab: ProfileTab;
}) {
  if (!posts.length) return <EmptyGrid isOwnProfile={isOwnProfile} tab={tab} />;

  return (
    <>
      {posts.map((post) => {
        const media = post.media[0];
        if (!media) return null;
        return (
          <Link
            key={post._id}
            href={`/p/${post._id}`}
            aria-label={`Mở bài viết của @${post.user.username}`}
            className="group relative aspect-square overflow-hidden bg-gray-100"
          >
            {media.mediaType === "video" ? (
              <video
                src={media.url}
                className="h-full w-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={media.url}
                alt={post.caption ?? ""}
                className="h-full w-full object-cover"
              />
            )}
            <span className="absolute inset-0 hidden items-center justify-center gap-6 bg-black/35 text-sm font-semibold text-white group-hover:flex">
              <span className="flex items-center gap-2">
                <Heart size={20} fill="white" />
                {post.likes?.length ?? 0}
              </span>
              <MessageCircle size={20} fill="white" />
            </span>
          </Link>
        );
      })}
    </>
  );
}

function ReelsGrid({
  reels,
  isOwnProfile,
}: {
  reels: Reel[];
  isOwnProfile: boolean;
}) {
  if (!reels.length) {
    return <EmptyGrid isOwnProfile={isOwnProfile} tab="reels" />;
  }

  return (
    <>
      {reels.map((reel) => (
        <Link
          key={reel._id}
          href="/reels"
          aria-label={`Xem reel của @${reel.user.username}`}
          className="relative aspect-square overflow-hidden bg-black"
        >
          <video
            src={reel.mediaUrls[0]}
            className="h-full w-full object-cover"
            muted
            playsInline
          />
          <Clapperboard
            size={20}
            className="absolute right-3 top-3 text-white drop-shadow"
          />
        </Link>
      ))}
    </>
  );
}

export default function ProfileView({ username }: { username?: string }) {
  const signedInUser = useAuthStore((state) => state.user);
  const ownProfileQuery = useUserProfile(!username);
  const otherProfileQuery = useUserByUsername(username ?? "");
  const profile = username ? otherProfileQuery.data : ownProfileQuery.data;
  const isOwnProfile = !!profile && profile._id === signedInUser?._id;
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const postsQuery = usePostsByUser(profile?._id ?? "");
  const bookmarksQuery = useBookmarks(isOwnProfile);
  const reelsQuery = useReelsByUser(
    profile?._id ?? "",
    activeTab === "reels",
  );
  const updateProfile = useUpdateOwnProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", fullname: "", bio: "" });
  const [shareNotice, setShareNotice] = useState("");

  useEffect(() => {
    if (!profile) return;
    setForm({
      username: profile.username,
      fullname: profile.fullname ?? "",
      bio: profile.bio ?? "",
    });
    setActiveTab("posts");
  }, [profile]);

  const submitProfile = (event: FormEvent) => {
    event.preventDefault();
    updateProfile.mutate(form, { onSuccess: () => setEditing(false) });
  };

  const copyProfileLink = async () => {
    try {
      const link = new URL(
        `/profile/${profile?.username}`,
        window.location.origin,
      ).toString();
      await navigator.clipboard.writeText(link);
      setShareNotice("Đã sao chép liên kết trang cá nhân.");
    } catch {
      setShareNotice("Không thể sao chép liên kết.");
    }
    window.setTimeout(() => setShareNotice(""), 2500);
  };

  if (ownProfileQuery.isLoading || otherProfileQuery.isLoading) {
    return <p className="p-8 text-sm text-gray-500">Đang tải trang cá nhân...</p>;
  }
  if (!profile) {
    return <p className="p-8 text-sm text-gray-500">Không tìm thấy người dùng.</p>;
  }

  const posts = postsQuery.data?.docs ?? [];
  const saved = bookmarksQuery.data ?? [];
  const reels = reelsQuery.data?.docs ?? [];
  const isFollowing =
    !!signedInUser && (profile.followers ?? []).includes(signedInUser._id);
  const tabs: Array<{ key: ProfileTab; label: string; Icon: typeof Grid3X3 }> = [
    { key: "posts", label: "BÀI VIẾT", Icon: Grid3X3 },
    ...(isOwnProfile
      ? [{ key: "saved" as const, label: "ĐÃ LƯU", Icon: Bookmark }]
      : []),
    { key: "reels", label: "REELS", Icon: Clapperboard },
    { key: "tagged", label: "ĐƯỢC GẮN THẺ", Icon: Tag },
  ];

  return (
    <section className="h-full w-full overflow-y-auto px-4 py-8 md:px-10">
      <div className="mx-auto max-w-[935px]">
        <header className="flex flex-col gap-6 border-b pb-8 sm:flex-row sm:gap-10 md:gap-20">
          <div className="flex shrink-0 justify-center sm:w-[30%] sm:pt-2">
            <div className="relative h-28 w-28 sm:h-36 sm:w-36">
              <Image
                src={profile.avatarUrl || defaultUser}
                alt={profile.username}
                fill
                sizes="(max-width: 640px) 112px, 144px"
                className="rounded-full object-cover"
              />
              {isOwnProfile && (
                <Link
                  href="/create"
                  aria-label="Thêm tin mới"
                  className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white"
                >
                  <Camera size={18} />
                </Link>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl">{profile.username}</h1>
              {isOwnProfile ? (
                <>
                  <button
                    type="button"
                    onClick={() => setEditing((value) => !value)}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200"
                  >
                    Chỉnh sửa trang cá nhân
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("saved")}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200"
                  >
                    Xem nội dung đã lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => void copyProfileLink()}
                    aria-label="Chia sẻ trang cá nhân"
                    className="rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
                  >
                    Chia sẻ trang cá nhân
                  </button>
                </>
              ) : (
                <>
                  <FollowButton
                    targetId={profile._id}
                    isFollowing={isFollowing}
                  />
                  <Link
                    href="/messages"
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold"
                  >
                    Nhắn tin
                  </Link>
                  <ReportButton targetType="user" targetId={profile._id} />
                </>
              )}
            </div>

            <div className="my-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
              <span>
                <b>{postsQuery.data?.totalDocs ?? posts.length}</b> bài viết
              </span>
              <span>
                <b>{profile.followersCount ?? profile.followers?.length ?? 0}</b>{" "}
                người theo dõi
              </span>
              <span>
                <b>{profile.followingCount ?? profile.following?.length ?? 0}</b>{" "}
                đang theo dõi
              </span>
            </div>

            <div className="text-sm">
              <p className="font-semibold">{profile.fullname}</p>
              {profile.bio && (
                <p className="mt-1 whitespace-pre-wrap">{profile.bio}</p>
              )}
            </div>
            {shareNotice && (
              <p role="status" className="mt-3 text-xs text-gray-500">
                {shareNotice}
              </p>
            )}
          </div>
        </header>

        {isOwnProfile && (
          <div className="flex min-h-36 items-center border-b py-6">
            <Link
              href="/create"
              className="flex w-20 flex-col items-center gap-2 text-xs"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-gray-50">
                <Plus size={30} className="text-gray-500" />
              </span>
              Mới
            </Link>
          </div>
        )}

        {editing && isOwnProfile && (
          <form onSubmit={submitProfile} className="my-6 grid gap-3">
            <input
              aria-label="Tên người dùng"
              value={form.username}
              onChange={(event) =>
                setForm({ ...form, username: event.target.value })
              }
              className="rounded border px-3 py-2"
              required
            />
            <input
              aria-label="Tên hiển thị"
              value={form.fullname}
              onChange={(event) =>
                setForm({ ...form, fullname: event.target.value })
              }
              className="rounded border px-3 py-2"
            />
            <textarea
              aria-label="Tiểu sử"
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              className="rounded border px-3 py-2"
              maxLength={300}
            />
            <button
              disabled={updateProfile.isPending}
              className="w-fit rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            {updateProfile.isError && (
              <p className="text-sm text-red-600">
                Không lưu được trang cá nhân.
              </p>
            )}
          </form>
        )}

        <nav className="mb-1 flex justify-center gap-8 border-b sm:gap-12">
          {tabs.map(({ key, label, Icon }) => (
            <button
              type="button"
              key={key}
              onClick={() => setActiveTab(key)}
              aria-current={activeTab === key ? "page" : undefined}
              className={`flex items-center gap-2 border-t py-4 text-[10px] font-semibold tracking-widest sm:text-xs ${
                activeTab === key
                  ? "border-black text-black"
                  : "border-transparent text-gray-500"
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        {((activeTab === "posts" && postsQuery.isLoading) ||
          (activeTab === "saved" && bookmarksQuery.isLoading) ||
          (activeTab === "reels" && reelsQuery.isLoading)) && (
          <p className="py-16 text-center text-sm text-gray-500">Đang tải...</p>
        )}
        {activeTab === "posts" && !postsQuery.isLoading && (
          <div className="grid grid-cols-3 gap-1">
            <PostsGrid posts={posts} isOwnProfile={isOwnProfile} tab="posts" />
          </div>
        )}
        {activeTab === "saved" && isOwnProfile && !bookmarksQuery.isLoading && (
          <div className="grid grid-cols-3 gap-1">
            <PostsGrid posts={saved} isOwnProfile tab="saved" />
          </div>
        )}
        {activeTab === "reels" && !reelsQuery.isLoading && (
          <div className="grid grid-cols-3 gap-1">
            <ReelsGrid reels={reels} isOwnProfile={isOwnProfile} />
          </div>
        )}
        {activeTab === "tagged" && (
          <div className="grid grid-cols-3 gap-1">
            <EmptyGrid isOwnProfile={false} tab="tagged" />
          </div>
        )}
      </div>
    </section>
  );
}
