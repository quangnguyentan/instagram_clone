"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import Link from "next/link";
import instagramLogo from "@/assets/images/Instagram_logo.svg";
import { sidebarItems } from "@/lib/constants";
import Image from "next/image";
import { InstagramIcon, MenuIcon } from "../ui/Icon";
import SearchPanel from "./SearchPanel";
import useSeletedMenuStore from "@/stores/selectedMenuStore";
import { motion } from "framer-motion";
import BaseDropdown from "../custom/BaseDropdown";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { dropdownItems } from "@/lib/dropdownItems";
import useModalStore from "@/stores/modalStore";
import NotificationPanel from "./NotificationPanel";

const SidebarMenu = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { setModal } = useModalStore();
  const { selected, setSelected } = useSeletedMenuStore();
  const logout = useAuthStore((s) => s.logout);

  const handleSwitchAccount = () => {
    setModal("login");
  };
  return (
    <div className="h-full py-8 w-full flex items-center">
      <motion.div
        className="flex flex-col justify-between h-full bg-white px-3"
        animate={{ width: searchOpen ? 72 : 300 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="px-3">
            <div className="w-full">
              {searchOpen || notificationOpen ? (
                <div className="w-28 h-10">
                  <InstagramIcon className="w-6 h-6" />
                </div>
              ) : (
                <Image
                  src={instagramLogo}
                  className="w-28 h-10"
                  alt="instagram"
                />
              )}
            </div>
          </div>

          <TooltipProvider>
            <nav className="flex flex-col items-start gap-2">
              {sidebarItems?.map(({ label, href, icon: Icon }) => {
                if (label === "Tìm kiếm") {
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setSearchOpen(true);
                      }}
                      className="flex items-center gap-3 rounded-sm py-3 px-3 hover:bg-muted cursor-pointer w-full"
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          selected === label
                            ? "text-black "
                            : "fill-none stroke-current"
                        }`}
                      />
                      {!searchOpen && !notificationOpen && (
                        <span
                          className={`text-base truncate ${
                            selected === label ? "font-medium" : "font-normal"
                          }`}
                        >
                          {label}
                        </span>
                      )}
                    </button>
                  );
                }
                if (label === "Thông báo") {
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setNotificationOpen(true);
                      }}
                      className="flex items-center gap-3 rounded-sm py-3 px-3 hover:bg-muted cursor-pointer w-full"
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          selected === label
                            ? "text-black "
                            : "fill-none stroke-current"
                        }`}
                      />
                      {!notificationOpen && !searchOpen && (
                        <span
                          className={`text-base truncate  ${
                            selected === label ? "font-medium" : "font-normal"
                          }`}
                        >
                          {label}
                        </span>
                      )}
                    </button>
                  );
                }
                return (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <Link
                        onClick={() => {
                          setSelected(label);
                          setSearchOpen(false);
                          setNotificationOpen(false);
                        }}
                        href={href}
                        className="flex items-center gap-3 rounded-sm py-3 px-3 hover:bg-muted w-full"
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            selected === label
                              ? "text-black "
                              : "fill-none stroke-current"
                          }`}
                        />
                        {!searchOpen && !notificationOpen && (
                          <span
                            className={`text-base truncate ${
                              selected === label ? "font-medium" : "font-normal"
                            }`}
                          >
                            {label}
                          </span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="hidden lg:block">
                      <p>{label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </TooltipProvider>
        </div>
        {/* More menu */}
        <BaseDropdown
          items={dropdownItems(logout, handleSwitchAccount)}
          trigger={["click"]}
          className="hover:bg-muted py-3 px-3 rounded-sm w-full flex items-center cursor-pointer"
        >
          <button
            className="flex items-center gap-3 w-full "
            onClick={() => {
              setSelected("Xem thêm");
              setSearchOpen(false);
              setNotificationOpen(false);
            }}
          >
            <MenuIcon className="w-6 h-6" />
            {!searchOpen && !notificationOpen && (
              <span
                className={`text-base truncate ${
                  selected === "Xem thêm" ? "font-medium" : "font-normal"
                }`}
              >
                Xem thêm
              </span>
            )}
          </button>
        </BaseDropdown>
      </motion.div>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationPanel
        open={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />
    </div>
  );
};

export default SidebarMenu;
