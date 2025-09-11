"use client";
import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import { useLogin, useRegister } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import useModalStore from "@/stores/modalStore";
import instagramLogo from "@/assets/images/Instagram_logo.svg";
import landing from "@/assets/images/landing.png";
import facebook from "@/assets/images/facebook.webp";

import Image from "next/image";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

interface LoginFormProps {
  className?: string;
  onLogin: (email: string, password: string) => void;
  onRegister: () => void;
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
  onLogin,
  onRegister,
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
  const router = useRouter();
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState(true);
  const { open } = useModalStore();
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();
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
        username: values.email as string,
      });
    }

    router.push("/");
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
        <div className="flex flex-col items-center justify-center gap-6">
          {isAuthenticated && (
            <Image
              src={instagramLogo}
              width={175}
              height={51}
              alt="Instagram_logo"
            />
          )}
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: false }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="on"
            className="flex flex-col items-center justify-center w-full"
            onValuesChange={() => {
              const hasError = form
                .getFieldsError()
                .some(({ errors }) => errors.length);
              const hasEmpty =
                !form.getFieldValue("email") || !form.getFieldValue("password");
              setIsDisabled(hasError || hasEmpty);
            }}
          >
            <Form.Item<FieldType>
              name="email"
              // rules={[{ required: true, message: "Please input your email!" }]}
              className="w-80"
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
              className="w-80"
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

            {isAuthenticated && (
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
                loading={type === "login" ? isLoginPending : isRegisterPending}
              >
                {submitButtonLabel || "Đăng nhập"}
              </Button>
            </Form.Item>
            {!isAuthenticated && (
              <Divider className="mt-0! ">
                <span className="text-xs text-gray-500">HOẶC</span>
              </Divider>
            )}
            {!isAuthenticated && (
              <Form.Item label={null} className="w-80">
                <Button
                  type="link"
                  htmlType="button"
                  className="w-full text-blue-500! font-medium!"
                  // onClick={facebookLogin}
                  icon={<Image src={facebook} alt="facebook" width={20} />}
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
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
