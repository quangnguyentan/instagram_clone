/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import useModalStore from "@/stores/modalStore";
import LoginForm from "@/app/features/auth/components/LoginForm";
import BaseModal from "../custom/BaseModal";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import PostViewModalContent from "./PostViewModalContent";

const GlobalModals = () => {
  const { open, type, data, closeModal } = useModalStore();
  const { accessToken } = useAuthStore();
  const renderModalContent = () => {
    switch (type) {
      case "post":
      case "comment":
        return (
          <PostViewModalContent
            media={data?.media || []}
            comments={data?.comments || []}
            caption={data?.caption}
          />
        );
      case "login":
        return (
          <LoginForm
            onForgotPassword={() => {}}
            submitButtonLabel="Đăng nhập"
            submitButtonClassName="w-full"
            isAuthenticated={!!accessToken}
          />
        );
      default:
        return <div>Modal không xác định</div>;
    }
  };

  if (!open || !type) return null;

  return (
    <BaseModal
      useGlobalState={true}
      // title={data?.caption || type.charAt(0).toUpperCase() + type.slice(1)}
      modalContent={renderModalContent()}
      onOk={closeModal}
      onCancel={closeModal}
      width={type === "post" || type === "comment" ? "80%" : 400} // Điều chỉnh width cho login
    />
  );
};

export default GlobalModals;
