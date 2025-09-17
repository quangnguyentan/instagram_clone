"use client";
import React, { useEffect, useRef, useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import { useLogin, useRegister } from "../hooks/useAuth";
import useModalStore from "@/stores/modalStore";
import instagramLogo from "@/assets/images/Instagram_logo.svg";
import landing from "@/assets/images/landing.png";
import facebook from "@/assets/images/facebook.webp";

import Image from "next/image";
import { useNavigate } from "@/hooks/useNavigate";
import { BaseNotificationRef } from "@/shared/custom/BaseNotification";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
  fullname?: string;
  username?: string;
};

interface LoginFormProps {
  className?: string;
  onForgotPassword: () => void;
  passwordHint?: React.ReactNode;
  facebookLogin?: () => void;
  submitButtonLabel?: string;
  submitButtonType?: "primary" | "default" | "dashed" | "text" | "link";
  submitButtonClassName?: string;
  hiddenSubmitButton?: boolean;
  passwordRemember?: boolean;
  type?: "login" | "register";
  isAuthenticated?: boolean; // Thêm prop isAuthenticated
}

const LoginForm = ({
  className,
  onForgotPassword,
  passwordHint,
  facebookLogin,
  submitButtonLabel,
  submitButtonType,
  submitButtonClassName,
  hiddenSubmitButton,
  passwordRemember,
  type = "login",
  isAuthenticated,
}: LoginFormProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState(true);
  const { open } = useModalStore();
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();

  const onLogin = () => {
    navigate("/");
  };
  const onRegister = () => {
    navigate("/accounts/emailsignup");
  };
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (type === "login") {
      login({
        email: values.email as string,
        password: values.password as string,
      });
    } else {
      register({
        email: values.email as string,
        password: values.password as string,
        username: values.username as string,
        fullname: values.fullname as string,
      });
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div>
      <div className="flex items-center justify-center gap-20">
        {!isAuthenticated && (
          <Image src={landing} width={522} height={450} alt="landing" />
        )}
        <div className="flex flex-col items-center justify-center gap-6 ">
          <div className={type === "login" ? "" : "p-10 border"}>
            {type && (
              <Image
                src={instagramLogo}
                width={175}
                height={51}
                alt="Instagram_logo"
                className="mx-auto"
              />
            )}
            <Form
              form={form}
              name="basic"
              initialValues={{ remember: false }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="on"
              className="flex flex-col items-center justify-center"
              onValuesChange={() => {
                const hasError = form
                  .getFieldsError()
                  .some(({ errors }) => errors.length);
                const hasEmpty =
                  type === "register"
                    ? !form.getFieldValue("email") ||
                      !form.getFieldValue("password") ||
                      !form.getFieldValue("fullname") ||
                      !form.getFieldValue("username")
                    : !form.getFieldValue("email") ||
                      !form.getFieldValue("password");
                setIsDisabled(hasError || hasEmpty);
              }}
            >
              {type === "register" && (
                <>
                  <div className="w-72 text-center pb-4">
                    <span className="font-bold text-gray-500 text-[16px] ">
                      Đăng ký để xem ảnh và video từ bạn bè.
                    </span>
                  </div>
                  <Form.Item label={null} className="w-80">
                    <Button
                      type={type === "register" ? "primary" : "link"}
                      htmlType="button"
                      className={
                        type !== "register"
                          ? "w-full text-blue-500! font-medium!"
                          : "w-full text-white bg-blue-400! font-medium!"
                      }
                      // onClick={facebookLogin}
                      icon={<Image src={facebook} alt="facebook" width={20} />}
                    >
                      Đăng nhập bằng Facebook
                    </Button>
                  </Form.Item>
                  <Divider className="mt-0! ">
                    <span className="text-xs text-gray-500">HOẶC</span>
                  </Divider>
                </>
              )}
              <div className="flex flex-col gap-2">
                <Form.Item<FieldType>
                  name="email"
                  // rules={[{ required: true, message: "Please input your email!" }]}
                  className="w-80 my-0! py-0!"
                >
                  <Input
                    placeholder="Số điện thoại, tên người dùng hoặc email"
                    className="placeholder:text-xs! placeholder:text-black/50!"
                    size="large"
                    variant="filled"
                  />
                </Form.Item>

                <Form.Item<FieldType>
                  name="password"
                  // rules={[{ required: true, message: "Please input your password!" }]}
                  className={
                    type === "login"
                      ? "w-80 my-0! py-0! pb-4!"
                      : "w-80 my-0! py-0!"
                  }
                >
                  <Input.Password
                    placeholder="Mật khẩu"
                    classNames={{
                      input: "placeholder:text-xs! placeholder:text-black/50!",
                    }}
                    size="large"
                    variant="filled"
                  />
                </Form.Item>

                {type === "register" && (
                  <>
                    <Form.Item<FieldType>
                      name="fullname"
                      // rules={[{ required: true, message: "Please input your email!" }]}
                      className="w-80 my-0! py-0!"
                    >
                      <Input
                        placeholder="Tên đầy đủ"
                        className="placeholder:text-xs! placeholder:text-black/50!"
                        size="large"
                        variant="filled"
                      />
                    </Form.Item>
                    <Form.Item<FieldType>
                      name="username"
                      // rules={[{ required: true, message: "Please input your email!" }]}
                      className="w-80 my-0! py-0! pb-4!"
                    >
                      <Input
                        placeholder="Tên người dùng"
                        className="placeholder:text-xs! placeholder:text-black/50!"
                        size="large"
                        variant="filled"
                      />
                    </Form.Item>
                  </>
                )}
              </div>
              {type === "register" && (
                <div className="w-70 text-center flex flex-col gap-2 text-[11px] text-gray-500">
                  <span className="text-xs text-gray-500">
                    Những người dùng dịch vụ của chúng tôi có thể đã tải thông
                    tin liên hệ của bạn lên Instagram.
                    <span className="text-blue-600">Tìm hiểu thêm</span>
                  </span>
                  <div className="">
                    <span>Bằng cách đăng ký, bạn đồng ý với {""}</span>
                    <span className="text-blue-600 text-[13px]">
                      Điều khoản, Chính sách quyền riêng tư và Chính sách cookie
                    </span>
                    <span>{""} của chúng tôi.</span>
                  </div>
                </div>
              )}
              {isAuthenticated && type !== "register" && (
                <Form.Item<FieldType>
                  name="remember"
                  valuePropName="checked"
                  label={null}
                  hidden={passwordRemember}
                  className="w-80 flex justify-start"
                >
                  <Checkbox className="text-xs!">
                    Lưu thông tin đăng nhập
                  </Checkbox>
                </Form.Item>
              )}

              <Form.Item label={null} className="w-80">
                <Button
                  type="primary"
                  htmlType="submit"
                  className={`${submitButtonClassName ? submitButtonClassName : "w-80"} ${isDisabled ? "opacity-50 bg-blue-400 pointer-events-none" : ""}`}
                  loading={
                    type === "login" ? isLoginPending : isRegisterPending
                  }
                >
                  {submitButtonLabel || "Đăng nhập"}
                </Button>
              </Form.Item>

              {type === "login" && (
                <>
                  {!isAuthenticated && (
                    <Divider className="mt-0! ">
                      <span className="text-xs text-gray-500">HOẶC</span>
                    </Divider>
                  )}
                  {!isAuthenticated && (
                    <Form.Item label={null} className="w-80 my-0! py-0!">
                      <Button
                        type="link"
                        htmlType="button"
                        className="w-full text-blue-500! font-medium!"
                        // onClick={facebookLogin}
                        icon={
                          <Image src={facebook} alt="facebook" width={20} />
                        }
                      >
                        Đăng nhập bằng Facebook
                      </Button>
                    </Form.Item>
                  )}
                  <Form.Item label={null} className="w-80">
                    <Button
                      type="link"
                      htmlType="submit"
                      className="w-full hover:underline text-black! font-medium!"
                    >
                      Quên mật khẩu?
                    </Button>
                  </Form.Item>
                  {!isAuthenticated && (
                    <Form.Item
                      label={null}
                      className="flex items-center justify-center w-80"
                    >
                      <span>Bạn chưa có tài khoản ư?</span>
                      <Button
                        type="link"
                        htmlType="button"
                        className="hover:underline text-purple-500! font-medium! px-1!"
                        onClick={onRegister}
                      >
                        Đăng ký
                      </Button>
                    </Form.Item>
                  )}
                </>
              )}
            </Form>
          </div>

          {type === "register" && (
            <div className="w-full text-center flex flex-col items-center justify-center border py-6">
              <span className="text-sm">Bạn có tài khoản?</span>
              <button
                type="button"
                className="hover:underline text-purple-500! font-medium! py-0! my-0! text-sm cursor-pointer"
                onClick={onLogin}
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
