"use client";
import LoginForm from "@/app/features/auth/components/LoginForm";
import React from "react";

const RegisterEmail = () => {
  return (
    <div>
      <LoginForm
        type="register"
        onLogin={() => {}}
        onRegister={() => {}}
        onForgotPassword={() => {}}
      />
    </div>
  );
};

export default RegisterEmail;
