"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { useEffect } from "react";
import setupInterceptors from "@/utils/api-interceptors";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    setupInterceptors();
  }, []);
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
