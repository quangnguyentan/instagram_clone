import SidebarMenu from "@/shared/layout/SidebarMenu";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-screen flex py-8">
      <div className="h-full" style={{ width: "300px" }}>
        <SidebarMenu />
      </div>
      <div
        className="h-full flex items-center justify-center"
        style={{ width: "calc(100% - 300px)" }}
      >
        {children}
      </div>
    </main>
  );
};

export default layout;
