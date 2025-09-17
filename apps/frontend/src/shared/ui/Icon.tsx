import { cn } from "@/lib/utils";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  ClipboardPlus,
  Compass,
  Heart,
  House,
  ImageIcon,
  Instagram,
  Menu,
  MessageCircle,
  MessageCircleWarning,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
type IconProps = React.SVGProps<SVGSVGElement>;

export const InstagramIcon = ({ className, ...props }: IconProps) => {
  return <Instagram className={cn(className)} {...props} />;
};
export const HouseIcon = ({ className, ...props }: IconProps) => {
  return <House className={cn(className)} {...props} />;
};
export const SearchIcon = ({ className, ...props }: IconProps) => {
  return <Search className={cn(className)} {...props} />;
};
export const CompassIcon = ({ className, ...props }: IconProps) => {
  return <Compass className={cn(className)} {...props} />;
};
export const ClapperboardIcon = ({ className, ...props }: IconProps) => {
  return <Clapperboard className={cn(className)} {...props} />;
};
export const MessageIcon = ({ className, ...props }: IconProps) => {
  return <MessageCircle className={cn(className)} {...props} />;
};
export const HeartIcon = ({ className, ...props }: IconProps) => {
  return <Heart className={cn(className)} {...props} />;
};
export const ClipboardIcon = ({ className, ...props }: IconProps) => {
  return <ClipboardPlus className={cn(className)} {...props} />;
};
export const UserIcon = ({ className, ...props }: IconProps) => {
  return <UserRound className={cn(className)} {...props} />;
};
export const MenuIcon = ({ className, ...props }: IconProps) => {
  return <Menu className={cn(className)} {...props} />;
};
export const SettingsIcon = ({ className, ...props }: IconProps) => {
  return <Settings className={cn(className)} {...props} />;
};
export const ImgIcon = ({ className, ...props }: IconProps) => {
  return <ImageIcon className={cn(className)} {...props} />;
};
export const BookMarkIcon = ({ className, ...props }: IconProps) => {
  return <Bookmark className={cn(className)} {...props} />;
};
export const SunIcon = ({ className, ...props }: IconProps) => {
  return <Sun className={cn(className)} {...props} />;
};
export const MoonIcon = ({ className, ...props }: IconProps) => {
  return <Moon className={cn(className)} {...props} />;
};
export const MessageWarningIcon = ({ className, ...props }: IconProps) => {
  return <MessageCircleWarning className={cn(className)} {...props} />;
};
export const LeftIcon = ({ className, ...props }: IconProps) => {
  return <ChevronLeft className={cn(className)} {...props} />;
};
export const RightIcon = ({ className, ...props }: IconProps) => {
  return <ChevronRight className={cn(className)} {...props} />;
};
