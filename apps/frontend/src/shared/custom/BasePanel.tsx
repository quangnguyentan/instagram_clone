"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BasePanelProps {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export default function BasePanel({
  open,
  onClose,
  children,
}: Readonly<BasePanelProps>) {
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
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
          className="absolute top-0 left-[72px] w-[400px] h-full bg-white shadow-[4px_0_10px_rgba(0,0,0,0.1)] rounded-r-2xl z-10"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
