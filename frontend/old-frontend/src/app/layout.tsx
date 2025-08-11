"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { useAuth } from "@/hooks/use-auth";
import { AlertDialogProvider } from "@/components/ui/alert-dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import SessionExpired from "@/utils/SessionExpired";

const inter = Inter({ subsets: ["latin"] });

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <AlertDialogProvider>
            {children}
            <SessionExpired onRedirect={logout} />
            <Toaster />
          </AlertDialogProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
