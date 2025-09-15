'use client';

import React from "react";
import Navbar from '../components/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // use your own Navbar/Theme Providers here later if you want
  return (
    <div className="flex h-dvh max-h-dvh w-full overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar/>
        <main className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6 mx-2 md:mx-3 lg:mx-4 xl:mx-6">
          
          <div className="mx-auto w-full max-w-[1100px] origin-top scale-[0.8]">{children}</div>
        </main>
      </div>
    </div>
  );
}
