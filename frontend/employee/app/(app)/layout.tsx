'use client';

import React from "react";
import Navbar from '../components/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // use your own Navbar/Theme Providers here later if you want
  return (
    <div className="flex h-dvh max-h-dvh w-full overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar/>
        <main className="flex-1 overflow-y-auto p-6 mx-2 md:mx-4 lg:mx-6 xl:mx-8">
          
          <div className="mx-auto w-full max-w-[1100px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
