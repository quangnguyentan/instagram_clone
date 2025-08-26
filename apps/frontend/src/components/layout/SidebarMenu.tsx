"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import instagramLogo from "@/assests/images/Instagram_logo.svg";
import { sidebarItems } from "@/lib/constants";
import Image from "next/image";
import { InstagramIcon, MenuIcon } from "../ui/Icon";
import SearchPanel from "./SearchPanel";

const SidebarMenu = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  // trạng thái thu nhỏ sidebar khi panel mở
  const isCollapsed = searchOpen;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`px-6 py-8 flex flex-col justify-between h-full border-r ${
          isCollapsed ? "w-[72px]" : "w-[250px]"
        } transition-all duration-300`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div>
            {isCollapsed ? (
              <InstagramIcon className="w-6 h-6" />
            ) : (
              <Image src={instagramLogo} className="w-28 h-8" alt="instagram" />
            )}
          </div>

          {/* Menu */}
          <TooltipProvider>
            <nav className="flex flex-col items-start gap-2">
              {sidebarItems.map(({ label, href, icon: Icon }) => {
                if (label === "Tìm kiếm") {
                  return (
                    <button
                      key={label}
                      onClick={() => setSearchOpen(true)}
                      className="flex items-center gap-3 rounded-xl py-3 hover:bg-muted cursor-pointer"
                    >
                      <Icon className="w-6 h-6" />
                      {!isCollapsed && (
                        <span className="text-base font-medium">{label}</span>
                      )}
                    </button>
                  );
                }

                return (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <Link
                        href={href}
                        className="flex items-center gap-3 rounded-xl py-3 hover:bg-muted"
                      >
                        <Icon className="w-6 h-6" />
                        {!isCollapsed && (
                          <span className="text-base font-medium">{label}</span>
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

        {/* Cuối sidebar */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded-xl py-3 px-2">
          <MenuIcon className="w-6 h-6" />
          {!isCollapsed && (
            <span className="text-base font-medium">Xem thêm</span>
          )}
        </div>
      </div>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default SidebarMenu;
