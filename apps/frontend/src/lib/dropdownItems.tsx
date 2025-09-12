import { MenuProps } from "antd";
import {
  BookMarkIcon,
  ImgIcon,
  MessageWarningIcon,
  SettingsIcon,
  SunIcon,
} from "@/shared/ui/Icon";
export const dropdownItems = (
  logoutFn: () => void,
  handleSwitchAccount: () => void
): MenuProps["items"] => [
  {
    key: "settings",
    label: (
      <div className="flex items-center gap-2 py-2">
        <SettingsIcon />
        <span>Cài đặt</span>
      </div>
    ),
  },
  {
    key: "activity",
    label: (
      <div className="flex items-center gap-2 py-2">
        <ImgIcon />
        <span>Hoạt động của bạn</span>
      </div>
    ),
  },
  {
    key: "saved",
    label: (
      <div className="flex items-center gap-2 py-2">
        <BookMarkIcon />
        <span>Đã lưu</span>
      </div>
    ),
  },
  {
    key: "switch-mode",
    label: (
      <div className="flex items-center gap-2 py-2">
        <SunIcon />
        <span>Chuyển chế độ</span>
      </div>
    ),
  },
  {
    key: "report",
    label: (
      <div className="flex items-center gap-2 py-2">
        <MessageWarningIcon />
        <span>Báo cáo sự cố</span>
      </div>
    ),
  },
  {
    type: "divider",
  },
  {
    key: "switch-account",
    label: (
      <div className="flex items-center gap-2 py-2">
        <span>Chuyển tài khoản</span>
      </div>
    ),
    onClick: handleSwitchAccount,
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: (
      <div className="flex items-center gap-2 py-2">
        <span>Đăng xuất</span>
      </div>
    ),
    onClick: logoutFn,
  },
];
