// PostAddComment.tsx
import { useState } from "react";

export default function PostAddComment({
  onSubmit,
}: {
  onSubmit: (content: string) => void;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 border rounded px-2 py-1"
      />
      <button type="submit" className="ml-2 text-blue-500 font-semibold">
        Post
      </button>
    </form>
  );
}
