"use client";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import instagramLogo from "@/assets/images/Instagram_logo.svg";
import { sidebarItems } from "@/lib/constants";
import Image from "next/image";
import { InstagramIcon, MenuIcon } from "../ui/Icon";
import SearchPanel from "./SearchPanel";
import useSeletedMenuStore from "@/stores/selectedMenuStore";
import { motion } from "framer-motion";

const SidebarMenu = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { selected, setSelected } = useSeletedMenuStore();
  return (
    <div className="relative h-screen">
      <motion.div
        className="px-6 flex flex-col justify-between h-full border-r bg-white"
        animate={{ width: searchOpen ? 72 : 300 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
      >
        <div className="flex flex-col gap-8">
          <div className="w-28 h-8">
            {searchOpen ? (
              <div>
                <InstagramIcon className="w-6 h-6" />
              </div>
            ) : (
              <Image src={instagramLogo} className="w-28 h-8" alt="instagram" />
            )}
          </div>

          <TooltipProvider>
            <nav className="flex flex-col items-start gap-2">
              {sidebarItems.map(({ label, href, icon: Icon }) => {
                if (label === "Tìm kiếm") {
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setSearchOpen(true);
                      }}
                      className="flex items-center gap-3 rounded-xl py-3 hover:bg-muted cursor-pointer w-full"
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          selected === label
                            ? "text-black "
                            : "fill-none stroke-current"
                        }`}
                      />
                      {!searchOpen && (
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

                return (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <Link
                        onClick={() => {
                          setSelected(label);
                          setSearchOpen(false);
                        }}
                        href={href}
                        className="flex items-center gap-3 rounded-xl py-3 hover:bg-muted w-full"
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            selected === label
                              ? "text-black "
                              : "fill-none stroke-current"
                          }`}
                        />
                        {!searchOpen && (
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

        <button
          className="flex items-center gap-3 cursor-pointer hover:bg-muted rounded-xl w-full"
          onClick={() => setSelected("Xem thêm")}
        >
          <MenuIcon className="w-6 h-6" />
          {!searchOpen && (
            <span
              className={`text-base truncate ${
                selected === "Xem thêm" ? "font-medium" : "font-normal"
              }`}
            >
              Xem thêm
            </span>
          )}
        </button>
      </motion.div>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default SidebarMenu;
