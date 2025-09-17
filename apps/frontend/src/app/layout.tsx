import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "../providers/QueryClientProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";

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
    <html lang="en">
      <body suppressHydrationWarning>
        <NotificationProvider>
          <Providers>{children}</Providers>
        </NotificationProvider>
      </body>
    </html>
  );
}
