// PostAddComment.tsx
import { useState } from "react";

export default function PostAddComment({
  onSubmit,
}: Readonly<{
  onSubmit: (content: string) => void;
}>) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center relative after:absolute after:content-[''] after:w-full after:h-px after:border-b after:border-gray-300 after:left-0 after:bottom-0 pb-4"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Bình luận..."
        className="flex-1 rounded py-1 focus:outline-none text-sm"
      />
      {value?.length >= 1 && (
        <button type="submit" className="ml-2 text-blue-500 font-semibold">
          Đăng
        </button>
      )}
    </form>
  );
}
