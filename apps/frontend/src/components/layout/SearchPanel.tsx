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

  // Đóng khi click ra ngoài
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
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: "keyframes", duration: 0.3 }}
          className="w-[400px] border-r h-screen bg-white p-6 shadow-[4px_0_10px_rgba(0,0,0,0.1)] relative rounded-r-2xl"
        >
          <h2 className="text-lg font-semibold mb-4">Tìm kiếm</h2>
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Mới đây</h3>
            <p className="text-sm text-gray-500">
              Không có nội dung tìm kiếm mới đây.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
