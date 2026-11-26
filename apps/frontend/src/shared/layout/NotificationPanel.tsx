"use client";

import Link from "next/link";
import BasePanel from "../custom/BasePanel";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useSocial";

interface NotificationPanelProps {
  open: boolean;
  onClose?: () => void;
}

const notificationText = {
  like: "đã thích nội dung của bạn",
  comment: "đã bình luận về nội dung của bạn",
  follow: "đã bắt đầu theo dõi bạn",
  mention: "đã nhắc đến bạn",
} as const;

export default function NotificationPanel({
  open,
  onClose,
}: Readonly<NotificationPanelProps>) {
  const { data: notifications = [], isLoading, isError } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <BasePanel open={open} onClose={onClose}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 pb-4 pt-6">
          <h2 className="text-2xl font-semibold">Thông báo</h2>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="text-xs font-semibold text-blue-600 disabled:opacity-50"
            >
              Đánh dấu đã đọc
            </button>
          )}
        </div>
        <div className="h-px bg-gray-200" />
        {isLoading ? (
          <p className="p-6 text-sm text-gray-500">Đang tải thông báo...</p>
        ) : isError ? (
          <p className="p-6 text-sm text-red-600">Không tải được thông báo.</p>
        ) : notifications.length === 0 ? (
          <p className="flex flex-1 items-center justify-center px-6 text-center text-sm text-gray-500">
            Chưa có thông báo mới.
          </p>
        ) : (
          <ul className="overflow-y-auto">
            {notifications.map((notification) => (
              <li key={notification._id}>
                <Link
                  href={notification.post ? "/" : `/profile/${notification.fromUser.username}`}
                  onClick={() => {
                    if (!notification.isRead) markRead.mutate(notification._id);
                    onClose?.();
                  }}
                  className={`flex items-center gap-3 px-5 py-4 hover:bg-gray-50 ${notification.isRead ? "" : "bg-blue-50"}`}
                >
                  <img
                    src={notification.fromUser.avatarUrl || "/default-avatar.png"}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <b>{notification.fromUser.username}</b>{" "}
                      {notificationText[notification.type]}
                    </p>
                    <time className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </time>
                  </div>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BasePanel>
  );
}
