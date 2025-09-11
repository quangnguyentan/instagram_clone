import {
  HouseIcon,
  SearchIcon,
  CompassIcon,
  ClapperboardIcon,
  MessageIcon,
  HeartIcon,
  ClipboardIcon,
  UserIcon,
} from "@/shared/ui/Icon"; // đổi path theo file của bạn

export const sidebarItems = [
  {
    label: "Trang chủ",
    href: "/",
    icon: HouseIcon,
  },
  {
    label: "Tìm kiếm",
    href: "/search",
    icon: SearchIcon,
  },
  {
    label: "Khám phá",
    href: "/explore",
    icon: CompassIcon,
  },
  {
    label: "Reels",
    href: "/reels",
    icon: ClapperboardIcon,
  },
  {
    label: "Tin nhắn",
    href: "/messages",
    icon: MessageIcon,
  },
  {
    label: "Thông báo",
    href: "/notifications",
    icon: HeartIcon,
  },
  {
    label: "Tạo",
    href: "/create",
    icon: ClipboardIcon,
  },
  {
    label: "Trang cá nhân",
    href: "/profile",
    icon: UserIcon,
  },
  // nếu muốn thêm phần “Xem thêm” và “Meta” ở dưới thì có thể để riêng
];
