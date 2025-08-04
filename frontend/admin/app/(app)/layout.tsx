"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { BreadcrumbProvider } from "@/hooks/useBreadcrumb";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BreadcrumbProvider>
      <div className="flex h-dvh max-h-dvh w-full min-w-dvw overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden grow">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 mx-4 md:mx-8">
            {children}
          </main>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}