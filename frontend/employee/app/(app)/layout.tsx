'use client';

import React from "react";
import Navbar from '../components/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh max-h-dvh w-full overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar/>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 mx-2 md:mx-4 lg:mx-6 xl:mx-8 bg-transparent">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="origin-top scale-[0.9] md:scale-[0.9] lg:scale-[0.9] xl:scale-[0.9] 2xl:scale-[0.9]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
