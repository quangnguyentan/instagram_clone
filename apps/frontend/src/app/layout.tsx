import type { Metadata } from "next";
import "../styles/globals.css";
import Providers from "../providers/QueryClientProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { SocketProvider } from "../providers/SocketProvider";
import GlobalModals from "@/shared/layout/GlobalModals";
import ClientInitializer from "@/providers/ClientInitializer";
import { NProgressBar } from "@/shared/layout/NProgressBar";

export const metadata: Metadata = {
  title: "Instagram",
  description: "Instagram clone",
  icons: {
    icon: "instagram.ico", // tìm trong public/
    shortcut: "instagram.ico",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="mdl-js">
      <body suppressHydrationWarning>
        <Providers>
          <SocketProvider>
            <NotificationProvider>
              <NProgressBar />
              <ClientInitializer />
              {children}
              <GlobalModals />
            </NotificationProvider>
          </SocketProvider>
        </Providers>
      </body>
    </html>
  );
}
