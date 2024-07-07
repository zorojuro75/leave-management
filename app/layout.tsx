"use client"
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-screen flex">
          <div className="flex-1">
            <div><SessionProvider>{children}</SessionProvider></div>
          </div>
        </div>
      </body>
    </html>
  );
}
