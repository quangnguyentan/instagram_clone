import React from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
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
}: LoginFormProps) => {
  return (
    <div>
      <Form
        name="basic"
        initialValues={{ remember: false }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="flex flex-col items-center justify-center w-full "
      >
        <Form.Item<FieldType>
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
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
          rules={[{ required: true, message: "Please input your password!" }]}
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

        <Form.Item<FieldType>
          name="remember"
          valuePropName="checked"
          label={null}
          hidden={passwordRemember}
          className="w-80 flex justify-start"
        >
          <Checkbox className="text-xs!">Lưu thông tin đăng nhập</Checkbox>
        </Form.Item>

        <Form.Item label={null} className="w-80">
          <Button
            type="primary"
            htmlType="submit"
            className={submitButtonClassName}
          >
            {submitButtonLabel || "Đăng nhập"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
