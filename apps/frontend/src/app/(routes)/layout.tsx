"use client";
import SidebarMenu from "@/shared/layout/SidebarMenu";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import LoginForm from "../features/auth/components/LoginForm";
import LoadingScreen from "@/shared/layout/LoadingScreen";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, accessToken } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <LoadingScreen />; // logo Instagram giữa màn hình
  }

  if (!accessToken || !user) {
    return (
      <main className="w-full h-screen flex items-center justify-center">
        <LoginForm
          onForgotPassword={() => {}}
          isAuthenticated={!!accessToken}
          type="login"
        />
      </main>
    );
  }

  if (user?.role !== "user") {
    return (
      <main className="w-full h-screen flex items-center justify-center">
        <p className="text-red-500">Bạn không có quyền truy cập</p>
      </main>
    );
  }
  return (
    <main className="w-full h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="h-[60px] md:h-full md:w-72 w-full border-b md:border-b-0 md:border-r ">
        <SidebarMenu />
      </div>

      {/* Nội dung */}
      <div className="flex-1 h-full flex items-center justify-center">
        {children}
      </div>
    </main>
  );
};

export default Layout;
