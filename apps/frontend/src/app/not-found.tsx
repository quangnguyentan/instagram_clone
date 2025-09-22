"use client";
import { useNavigate } from "@/hooks/useNavigate";

export default function NotFound() {
  const router = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <span className="text-2xl font-medium text-black">
        Rất tiếc, trang này hiện không khả dụng.
      </span>
      <div className="flex items-center">
        <p className="mt-4 text-black">
          Liên kết bạn theo dõi có thể bị hỏng hoặc trang này có thể đã bị gỡ
        </p>
        <button
          className="mt-4 text-blue-600 cursor-pointer"
          onClick={() => router("/")}
        >
          . Quay lại Instagram.
        </button>
      </div>
    </div>
  );
}
