"use client";
import React from "react";
import defaultUser from "@/assets/images/default_user.svg";
import instagramLogo from "@/assets/images/Instagram_logo.svg";
import Image from "next/image";
import BaseModal from "../custom/BaseModal";
import Login from "./LoginForm";
const AccountSwitcher = () => {
  return (
    <div className="flex items-center gap-2 w-full justify-between  ">
      <div className="flex items-center gap-1">
        <Image src={defaultUser} alt="default user" width={44} height={44} />
        <div className="flex flex-col justify-center ">
          <span className="text-sm font-medium">ntzz_code</span>
          <span className="text-sm">ntzz</span>
        </div>
      </div>
      <BaseModal
        buttonClassName="text-xs! font-bold! px-0! text-blue-500! hover:underline!"
        buttonLabel="Chuyển"
        buttonType="link"
        title={
          <Image
            src={instagramLogo}
            alt="default user"
            width={175}
            height={51}
            className="flex items-center justify-center mx-auto pt-14 pb-6 select-none "
          />
        }
        modalContent={
          <Login
            onLogin={() => {}}
            onRegister={() => {}}
            onForgotPassword={() => {}}
            submitButtonLabel="Đăng nhập"
            submitButtonClassName="w-full"
          />
        }
        onOk={() => {}}
        onCancel={() => {}}
      />
    </div>
  );
};

export default AccountSwitcher;
