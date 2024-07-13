"use client";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <title>Leave Management</title>
      </head>
      <body className={poppins.className}>
        <div className="flex bg-[#FBFDFD]">
          <div className="flex-1">
            <SessionProvider>{children}</SessionProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
