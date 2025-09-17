"use client";

import React, { createContext, useRef } from "react";
import BaseNotification, {
  BaseNotificationRef,
} from "@/shared/custom/BaseNotification";

export const NotificationContext =
  createContext<React.RefObject<BaseNotificationRef> | null>(null);

export function NotificationProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const notifyRef = useRef<BaseNotificationRef>(null);

  return (
    <NotificationContext.Provider
      value={notifyRef as React.RefObject<BaseNotificationRef>}
    >
      {children}
      <BaseNotification ref={notifyRef} pauseOnHover={false} showProgress />
    </NotificationContext.Provider>
  );
}
