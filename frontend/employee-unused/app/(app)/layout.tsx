"use client";

import { Navbar } from "";
import { BreadcrumbProvider } from "@/hooks/useBreadcrumb";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BreadcrumbProvider>
      <div className="flex h-dvh max-h-dvh w-full min-w-dvw overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden grow">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 mx-2 md:mx-4 lg:mx-6 xl:mx-8 scrollbar-gutter-stable">
            <div className="max-w-[1800px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </BreadcrumbProvider>
  );
}