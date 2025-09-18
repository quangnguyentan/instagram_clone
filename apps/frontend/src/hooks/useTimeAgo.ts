import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/timeAgo";

export function useTimeAgo(createdAt: string | Date) {
  const [label, setLabel] = useState(() => timeAgo(createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setLabel(timeAgo(createdAt));
    }, 60 * 1000); // cập nhật mỗi phút

    return () => clearInterval(interval);
  }, [createdAt]);

  return label;
}
