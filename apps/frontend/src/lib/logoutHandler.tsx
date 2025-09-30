import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { QueryClient } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { SessionExpiredModal } from "@/shared/layout/SessionExpiredModal";
import React from "react";

let queryClient: QueryClient | null = null;
let navigate: ((path: string, options?: { replace?: boolean }) => void) | null =
  null;

export const setLogoutContext = (
  qc: QueryClient,
  nav: (path: string, options?: { replace?: boolean }) => void
) => {
  queryClient = qc;
  navigate = nav;
};

export const globalLogout = (reason?: string) => {
  // clear auth store
  useAuthStore.getState().logout();

  // clear react-query cache
  if (queryClient) {
    queryClient.clear();
  }

  // mount modal vào body
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);

  const handleOk = () => {
    root.unmount();
    container.remove();
    if (navigate) {
      navigate("/", { replace: true });
    } else {
      window.location.href = "/";
    }
  };

  root.render(<SessionExpiredModal open={true} onOk={handleOk} />);
};
