"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-lg text-gray-600">Trang bạn tìm không tồn tại.</p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Quay về trang chủ
      </Link>
    </div>
  );
}
