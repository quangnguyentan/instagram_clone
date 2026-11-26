import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <span className="text-2xl font-medium text-black">
        Rất tiếc, trang này hiện không khả dụng.
      </span>
      <div className="flex items-center">
        <p className="mt-4 text-black">
          Liên kết bạn theo dõi có thể bị hỏng hoặc trang này có thể đã bị gỡ
        </p>
        <Link href="/" className="mt-4 text-blue-600">
          . Quay lại Instagram.
        </Link>
      </div>
    </div>
  );
}
