import SidebarMenu from "@/components/layout/SidebarMenu";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-screen flex">
      <div className="h-full" style={{ width: "300px" }}>
        <SidebarMenu />
      </div>
      <div
        className="h-full flex items-center justify-center"
        style={{ width: "calc(100% - 900px)" }}
      >
        {children}
      </div>
      <div className="h-full" style={{ width: "600px" }}>
        abc
      </div>
    </main>
  );
};

export default layout;
