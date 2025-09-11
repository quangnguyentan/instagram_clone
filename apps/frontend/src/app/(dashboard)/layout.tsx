"use client";
import SidebarMenu from "@/shared/layout/SidebarMenu";
import React from "react";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import LoginForm from "../features/auth/components/LoginForm";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, accessToken } = useAuthStore();
  if (!accessToken) {
    return (
      <main className="w-full h-screen flex items-center justify-center">
        <LoginForm
          onLogin={() => {}}
          onRegister={() => {}}
          onForgotPassword={() => {}}
          isAuthenticated={!!accessToken}
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
    <main className="w-full h-screen flex py-8">
      <div className="h-full" style={{ width: "300px" }}>
        <SidebarMenu />
      </div>
      <div
        className="h-full flex items-center justify-center"
        style={{ width: "calc(100% - 300px)" }}
      >
        {children}
      </div>
    </main>
  );
};

export default Layout;
