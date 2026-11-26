"use client";

import { useRouter } from "next/navigation";
import CreateComposer from "@/shared/layout/CreateComposer";

export default function CreatePage() {
  const router = useRouter();

  return (
    <CreateComposer
      open
      onClose={() => router.push("/")}
    />
  );
}
