import React from "react";
import defaultUser from "@/assets/images/default_user.svg";
import Image from "next/image";
const AccountSwitcher = () => {
  return (
    <div className="flex items-center gap-2 w-full justify-between">
      <div className="flex items-center gap-1">
        <Image src={defaultUser} alt="default user" width={44} height={44} />
        <div className="flex flex-col justify-center ">
          <span className="text-sm font-medium">ntzz_code</span>
          <span className="text-sm">ntzz</span>
        </div>
      </div>
      <button className="text-xs font-bold text-blue-500">Chuyển</button>
    </div>
  );
};

export default AccountSwitcher;
