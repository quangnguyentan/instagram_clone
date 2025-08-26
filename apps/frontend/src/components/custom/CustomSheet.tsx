// components/shared/CustomSheet.tsx
"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CustomSheetProps {
  side?: "top" | "bottom" | "left" | "right";
  title?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CustomSheet({
  side = "right",
  title,
  trigger,
  children,
  open,
  onOpenChange,
}: Readonly<CustomSheetProps>) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side={side} className="w-[400px] sm:w-[500px]">
        {title && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        )}
        <div className="mt-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
