import "./globals.css";
import React from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "../contexts/AuthContext";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
          <AuthProvider>
            <Providers>{children}</Providers>
          </AuthProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
