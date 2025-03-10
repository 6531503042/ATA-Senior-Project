"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import SessionExpired from "@/utils/SessionExpired";
import { useAuth } from '@/hooks/use-auth';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SessionExpired onRedirect={logout} />
      </body>
    </html>
  );
}