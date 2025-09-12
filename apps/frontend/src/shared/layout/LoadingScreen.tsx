"use client";
import instagramLogo from "@/assets/images/insta_icon.jpg";
import Image from "next/image";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black z-50">
      {/* Logo Instagram */}
      <Image
        src={instagramLogo} // để file logo ở public/instagram-logo.png
        alt="Instagram Logo"
        width={120}
        height={120}
        className="animate-pulse"
      />
    </div>
  );
};

export default LoadingScreen;
