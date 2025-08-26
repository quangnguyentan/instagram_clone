"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchPanelProps {
  open: boolean;
  onClose?: () => void;
}

export default function SearchPanel({
  open,
  onClose,
}: Readonly<SearchPanelProps>) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ x: -120, opacity: 0 }} // chỉ trượt nhẹ từ bên trái
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -120, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="w-[400px] border-r h-screen bg-white shadow-[4px_0_10px_rgba(0,0,0,0.1)] relative rounded-r-2xl"
        >
          <div className="flex flex-col h-full gap-4 ">
            <div className="px-4 pt-6">
              <h2 className="text-2xl font-semibold pb-8 px-2 ">Tìm kiếm</h2>
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="w-full border rounded-lg px-3 py-2 text-sm placeholder:text-base focus:outline-none border-none bg-gray-200/60"
              />
            </div>
            <div className="w-full h-[1.5px] bg-gray-200"></div>
            <h3 className="text-base font-medium px-6">Mới đây</h3>
            <div className="px-6 h-full flex items-center justify-center">
              <p className="text-sm text-gray-500  ">
                Không có nội dung tìm kiếm mới đây.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
