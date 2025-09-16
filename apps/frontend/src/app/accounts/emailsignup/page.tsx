"use client";
import LoginForm from "@/app/features/auth/components/LoginForm";
import { useNavigate } from "@/hooks/useNavigate";
import { useRouter } from "next/navigation";
import React, { use } from "react";

const RegisterEmail = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LoginForm
        submitButtonLabel="Đăng ký"
        type="register"
        onForgotPassword={() => {}}
        isAuthenticated={false}
      />
    </div>
  );
};

export default RegisterEmail;
