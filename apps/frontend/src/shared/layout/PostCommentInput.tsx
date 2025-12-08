"use client";
import React, { useImperativeHandle, useRef } from "react";

interface PostCommentInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  tagName?: string;
}

const PostInput = React.forwardRef<HTMLInputElement, PostCommentInputProps>(
  ({ value, onChange, onSubmit, tagName }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      if (tagName) {
        const tagPrefix = tagName + " ";

        // Nếu người dùng cố xóa hoặc sửa phần tagName ở đầu => không cho phép
        if (!newValue.startsWith(tagPrefix)) {
          return;
        }
      }

      onChange(newValue);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!tagName || !inputRef.current) return;

      const tagPrefix = tagName + " ";
      const cursorPos = inputRef.current.selectionStart ?? 0;

      // Nếu con trỏ đang nằm trong vùng tagName và nhấn Backspace/Delete
      if (
        (e.key === "Backspace" && cursorPos <= tagPrefix.length) ||
        (e.key === "Delete" && cursorPos < tagPrefix.length)
      ) {
        e.preventDefault();
        // Xóa luôn toàn bộ tagName + khoảng trắng
        const newValue = value.replace(tagPrefix, "");
        onChange(newValue);
        return;
      }
    };
    const handleClick = () => {
      // Nếu click vào phần tagName → đưa con trỏ ra sau tagName
      if (!tagName || !inputRef.current) return;
      const prefixLength = (tagName + " ").length;
      if (inputRef.current.selectionStart! < prefixLength) {
        inputRef.current.setSelectionRange(prefixLength, prefixLength);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(e);
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between w-full gap-2"
      >
        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          type="text"
          placeholder="Bình luận..."
          className="w-full px-2 py-1 border-gray-300 focus:outline-none"
        />
        <button
          type="submit"
          disabled={value.trim() === ""}
          className="disabled:opacity-50"
        >
          <span className="text-blue-500 font-semibold">Đăng</span>
        </button>
      </form>
    );
  }
);

PostInput.displayName = "PostInput";

export default PostInput;
