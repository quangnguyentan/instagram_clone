import { cn } from "@/lib/utils";
import {
  Clapperboard,
  ClipboardPlus,
  Compass,
  Heart,
  House,
  Instagram,
  Menu,
  MessageCircle,
  Search,
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
